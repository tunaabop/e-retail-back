// routes = controller, middleware between views and models
const router = require('express').Router();
// importing models here 
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET route to get all tags
router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    attributes: ["id", "tag_name"],
    // making sure to include its associated Product data
    include: [
      {
        model: Product,
        through: ProductTag,
        as: "tagged_product",
      }
    ]
  }).then((tagData) => res.json(tagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET route to get all IDs
router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    // be sure to include its associated Product data
    include: 
    [
      {
        model: Product,
        through: ProductTag,
        as: "tagged_product",
      }
    ]
  })
    .then((tagData) => {
      if (!tagData) {
        res.status(404).json({ message:"tag not found w/ ID"});
        return;
      }
      res.json(tagData);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST route to create a new tag
router.post('/', (req, res) => {
  // create a new tag
  Tag.create({tag_name: req.body.tag_name})
    .then((tagData) => res.json(tagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT route to update tag name by id
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {tag_name: req.body.tag_name},
    {where: {id: req.params.id}}
  ).then((tagData) => 
    {
      if (!tagData) {
        res.status(404).json({message: "Cannot find tag with ID"});
        return;
      }
      res.json(tagData);
    })
    .catch((err) => 
    {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE tag's route by id
router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  }).then((tagData) => {
      if (!tagData) {
        res.status(404).json({ message: "Sorry, No tag has been found with this ID" });
        return;
      }
      res.json(tagData);
    })
    .catch((err) => {
      console.log((err) => {res.status(500).json(err);});
    });
});

module.exports = router;
