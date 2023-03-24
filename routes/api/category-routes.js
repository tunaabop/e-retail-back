const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET route to find all categories and include its associated Products
router.get('/', (req, res) => {
  Category.findAll({
    attributes: ["id", "category_name"],
    include: 
    [{
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"]
    }]
  }).then((categoryData) => res.json(categoryData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET route to find one category by its `id` value, including its associated Products
router.get('/:id', (req, res) => {
  Category.findOne({
    // find category by requested id
    where: {id: req.params.id},
    attributes: ["id", "category_name"],
    include: 
    [{
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"]
    }]
  }).then((categoryData) => {
      if (!categoryData) {
        res.status(404).json({message: "Cannot find category"});
        return;
      }
      res.json(categoryData);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST route to create a new category
router.post('/', (req, res) => {
  Category.create({category_name: req.body.category_name,})
    .then((categoryData) => res.json(categoryData))
    .catch((err) =>{
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT route to update a category by its `id` value
router.put('/:id', (req, res) => {
  Category.update(
    {category_name: req.body.category_name},
    {where: { id: req.params.id }}
  )
  .then((categoryData) => {
    if (!categoryData) {
      res.status(404).json({ message: "Cannot find category" }); return;
    }
    res.json(categoryData);
  });
});

  // Delete route, or a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({where: {id: req.params.id}})
    .then((categoryData) => {
      if (!categoryData) {
        res.status(404).json({ message: "Cannot find category" });
        return;
      }
      
      res.json(categoryData);

    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Export routes
module.exports = router;
