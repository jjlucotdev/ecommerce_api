const Product = require("../models/Product");
const Category = require("../models/Category");

module.exports.addProduct = async (req, res) => {
	const { name, description, price, categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).send({ message: "Category not found" });
    }

    const newProduct = new Product({
        name,
        description,
        price,
        category
    });

	return await Product.findOne({ name })
	.then((product) => {
		if (product) {
			return res.status(409).send({ error : 'Product already exist' });
		}

		newProduct.save()
		.then((newProduct) => {
			return res.status(201).send({ newProduct });
		})
		.catch((err) => {
			console.error("Error in adding the product: ", err);
			return res.status(500).send({ error : 'Failed to add the product' });
		})
	})
	.catch((err) => {
		console.error("Error finding the product: ", err);
		return res.status(500).send({ error : "Error finding the product" });
	});
};

module.exports.getAllProducts = async (req, res) => {
	return await Product.find({})
	.then((products) => {
		return res.status(200).send({ products });
	})
	.catch((err) => {
		console.error("Error finding all products: ", err);
	 	return res.status(404).send({ error : "No products found" });
	});
};

module.exports.getAllActiveProducts = async (req, res) => {
	return await Product.find({ isActive: true })
	.then((activeProducts) => {
		return (activeProducts.length > 0) ? res.status(200).send({ activeProducts }) : res.status(200).send({ message: 'No active products found' });
	})
	.catch((err) => {
		console.error("Error finding active products: ", err);
	  	return res.status(500).send({ error : "Error finding active products" });
	});
};

module.exports.getProduct = async (req, res) => {
	const productId = req.params.productId;

	return await Product.findById(productId)
	.then((product) => {
		return product ? res.status(200).send({ product }) : res.status(404).send({ message: "Product not found" });
	})
	.catch((err) => {
		console.error("Error in finding product: ", err);
	  	return res.status(500).send({ error : "Error in finding product" });
	});
};

module.exports.updateProduct = async (req, res) => {

    const productId = req.params.productId

    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
    }

    return await Product.findByIdAndUpdate(productId, updatedProduct)
    .then(updatedProduct => {
        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found'});
        } else {
            return res.status(200).send({
                message: 'Product updated successfully',
                updatedProduct: updatedProduct
            });
        }
    })
    .catch (err => {
        console.error("Error in updating product: ", err)
        return res.status(500).send({ error: 'Error updating a product'})
    });
}

module.exports.archiveProduct = async (req, res) => {
    const productId = req.params.productId;
    const archivedProduct = { isActive: false };

    return await Product.findByIdAndUpdate(productId, archivedProduct)
    .then(product => {
        if (product) {
            return res.status(200).send({ message: 'Product archived successfully', archivedProduct: product });
        } else {
            return res.status(404).send({ error: 'Product not found' });
        }
    })
    .catch(err => {
        console.error("Error archiving product: ", err);
        return res.status(500).send({ error: 'Failed to archive product' });
    })
};

module.exports.activateProduct = async (req, res) => {
    const productId = req.params.productId;
    const activatedProduct = { isActive: true };

    return await Product.findByIdAndUpdate(productId, activatedProduct)
    .then(product => {
        if (product) {
            return res.status(200).send({ message: 'Product activated successfully', activatedProduct: product });
        } else {
            return res.status(404).send({ error: 'Product not found' });
        }
    })
    .catch(err => {
        console.error("Error activating product: ", err);
        return res.status(500).send({ error: 'Failed to activate product' });
    });
};

module.exports.searchProductsByName = async (req, res) => {
    const { productName } = req.body;

    return await Product.find({ 
        name: { $regex: productName, $options: 'i' }, 
        isActive: true 
    })
    .then(products => {
        if (products.length === 0) {
            return res.status(200).json({ message: "No results found." });
        } else {
            return res.status(200).json({ products });
        }
    })
    .catch(err => {
        console.error('Error searching products:', error);
        return res.status(500).json({ error: 'Internal server error' });
    });
};

module.exports.searchProductsByPrice = async (req, res) => {
    let minPrice = req.body.minPrice;
    let maxPrice = req.body.maxPrice;

    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    try {

        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).json({ error: 'Invalid price range' });
        }

        // Find active products within the given price range
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice },
            isActive: true // Include only active products
        });

        if (products.length > 0) {
            return res.status(200).json({ products });
        } else {
            return res.status(200).json({ message: 'No active products found within the specified price range.' });
        }
    } catch (error) {
        console.error('Error finding active products by price range:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


/* Category Management */
module.exports.addCategory = async (req, res) => {
    const { name, description } = req.body;

    const newCategory = new Category({
        name,
        description
    });

    return await Category.findOne({ name })
    .then((category) => {
        if (category) {
            return res.status(409).send({ error : 'Category already exist' });
        }

        newCategory.save()
        .then((newCategory) => {
            return res.status(201).send({ newCategory });
        })
        .catch((err) => {
            console.error("Error in adding the category: ", err);
            return res.status(500).send({ error : 'Failed to add the category' });
        })
    })
    .catch((err) => {
        console.error("Error finding the category: ", err);
        return res.status(500).send({ error : "Internal server error" });
    });
};

module.exports.updateCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    const { name, description } = req.body;

    const updatedCategory = {
        name,
        description
    }

    return await Category.findByIdAndUpdate(categoryId, updatedCategory)
    .then((updatedCategory) => {
          if (!updatedCategory) {
            return res.status(404).send({ error: 'Category not found'});
        } else {
            return res.status(200).send({
                message: 'Category updated successfully',
                updatedCategory: updatedCategory
            });
        }
    })
    .catch((err) => {
        console.error("Error updating the category: ", err);
        return res.status(500).send({ error : "Internal server error" });
    });
};

module.exports.getAllCategory = async (req, res) => {
    return await Category.find({})
    .then((categories) => {
        return res.status(200).send({ categories });
    })
    .catch((err) => {
        console.error("Error finding all categories: ", err);
        return res.status(404).send({ error : "No categories found" });
    });
};

module.exports.filterByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    
    return await Product.find({ 
        category: categoryId,
        isActive: true 
    })
    .then((products) => {
        if (products.length === 0) {
            return res.status(200).send({ message: "No results found." });
        } else {
            return res.status(200).send({ products });
        }
    })
    .catch((err) => {
        console.error("Error in fetching products: ", err);
        return res.status(500).send({ error : "Internal server error" });
    });   
};
