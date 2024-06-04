const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, mobileNo, password, address } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already exists. Please register a different email' });
        }

        if (typeof firstName !== 'string' || typeof lastName !== 'string') {
            return res.status(400).send({ error: 'First name and last name must be strings' });
        }

        if (!email.includes('@')) {
            return res.status(400).send({ error: 'Email Invalid' });
        }

        if (password.length < 8) {
            return res.status(400).send({ error: 'Password must be at least 8 characters' });
        }

        if (typeof mobileNo !== 'string' || mobileNo.length !== 11) {
            return res.status(400).send({ error: 'Mobile number invalid' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            mobileNo,
            password: bcrypt.hashSync(password, 10),
            addresses: [address] // Push the new address to the addresses array
        });

        await newUser.save();

        return res.status(201).send({ message: 'Registered Successfully' });
    } catch (error) {
        console.error('Internal server error: ', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
};

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (email && !email.includes('@')) {
        return res.status(400).send({ error: 'Email Invalid' });
    }
  
    return await User.findOne({ email })
    .then((result) => {
    	if (result == null) {
        	return res.status(404).send({ error: "No email found" });
        } else {
        	const isPasswordCorrect = bcrypt.compareSync(password, result.password);
          	if (isPasswordCorrect) {
            	return res.status(200).send({ access: auth.createAccessToken(result) });
          	} else {
            	return res.status(401).send({ error: 'Email and password do not match' });
          	}
        }
    })
	.catch((err) => {
		console.error("Error in find: ", err);
		return res.status(500).send({ error: 'Log in error' });
	});
};

module.exports.retrieveUserDetails = async (req, res) => {
    const userId = req.user.id;

    return await User.findById(userId)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.password = undefined;

        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
    	return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};

module.exports.setAsAdmin = async (req, res) => {
	const userId = req.params.id;
  
    return await User.findByIdAndUpdate(userId, { isAdmin: true })
    .then((result) => {
        return res.status(200).send({ message: 'User updated as admin successfully' });
    })
    .catch((err) => {
        console.error('Error updating user as admin:', error);
        return res.status(500).send({ message: 'Internal server error' });
    });
};

module.exports.updatePassword = async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
      
    return await User.findByIdAndUpdate(userId, { password: hashedPassword })
    .then((result) => {
        return res.status(201).send({ message : 'Password reset successfully' })
    })
    .catch((err) => {
        console.error('Error updating password:', error);
        return res.status(500).send({ message: 'Error updating password' });
    });
};

/** Address Management **/

module.exports.addAddress = async (req, res) => {
    const userId = req.user.id; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const { street, city, province, country, postalCode, pinLocation } = req.body;

        const hasDefaultAddress = user.addresses.some(address => address.isDefault);

        const newAddress = {
            street,
            city,
            province,
            country,
            postalCode,
            pinLocation,
            isDefault: !hasDefaultAddress 
        };

        
        if (!hasDefaultAddress) {
            user.addresses.forEach(address => {
                address.isDefault = false;
            });
        }

        user.addresses.push(newAddress);
        await user.save();

        return res.status(200).send({ message: 'Address added successfully', user });
    } catch (error) {
        console.error('Error adding address:', error);
        return res.status(500).send({ error: 'Failed to add address' });
    }
};

module.exports.updateAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(address => address._id == addressId);
        if (addressIndex === -1) {
            return res.status(404).send({ error: 'Address not found' });
        }

        const { street, city, province, country, postalCode, pinLocation } = req.body;

        user.addresses[addressIndex] = {
            _id: user.addresses[addressIndex]._id, 
            street,
            city,
            province,
            country,
            postalCode,
            pinLocation
        };

        await user.save();

        return res.status(200).send({ message: 'Address updated successfully', user });
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).send({ error: 'Failed to update address' });
    }
};

module.exports.deleteAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(address => address._id == addressId);
        if (addressIndex === -1) {
            return res.status(404).send({ error: 'Address not found' });
        }

        if (user.addresses.length === 1) {
            return res.status(400).send({ error: 'Cannot delete the last address' });
        }

        const isDefaultAddress = user.addresses[addressIndex].isDefault;

        user.addresses.splice(addressIndex, 1);

        if (isDefaultAddress && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return res.status(200).send({ message: 'Address deleted successfully', user });
    } catch (error) {
        console.error('Error deleting address:', error);
        return res.status(500).send({ error: 'Failed to delete address' });
    }
};

module.exports.setDefaultAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId; // Assuming the address ID is provided in the request parameters

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(address => address._id == addressId);
        if (addressIndex === -1) {
            return res.status(404).send({ error: 'Address not found' });
        }

        // Unset default for all addresses
        user.addresses.forEach(address => {
            address.isDefault = false;
        });

        // Set the selected address as default
        user.addresses[addressIndex].isDefault = true;

        await user.save();

        return res.status(200).send({ message: 'Default address set successfully', user });
    } catch (error) {
        console.error('Error setting default address:', error);
        return res.status(500).send({ error: 'Failed to set default address' });
    }
};