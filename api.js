const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {


  const { offset = 0, limit = 25, tag } = req.query

  try {
    res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,
      }))
    } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct (req, res, next) {


    const { id } = req.params

    try {
      const product = await Products.get(id)
      if (!product) {
        // next() is a callback that will pass the request to the next available route in the stack
        return next()
      }

      return res.json(product)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  async function createProduct (req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
  }

  async function deleteProduct(req, res) {
    const productId = req.params.id;
    console.log(`Product with ID ${productId} deleted`);
    res.status(202).json({ message: `Product with ID ${productId} deleted` });
}

async function updateProduct(req, res) {
    const productId = req.params.id;
    const updatedData = req.body;
    const result = await products.updateProduct(productId, updatedData);
    res.status(200).json(result);
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
  })