'use strict';

const express = require('express');
const router = express.Router();

// Load array of notes
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  
  notes.filter(searchTerm)
    .then(function(list) {
      if (list) {
        res.json(list);
      } else {
        next();
      }
    })
    .catch(function(err) {
      next(err);
    });
});

// notes.filter(searchTerm, (err, list) => {
//   if (err) {
//     return next(err); // goes to error handler
//   }
//   res.json(list); // responds with filtered array
// });


router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;

  notes.find(id)
    .then(function(item) {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(function(err) {
      next(err);
    });
});

// notes.find(id, (err, item, next) => {
//   if (err) {
//     return next(err); // goes to error handler
//   }
//   res.json(item); // responds with filtered array
// });

  



router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj) 
    .then(function(item) {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    }) 
    .catch(function(err) {
      next(err);
    });
});

// notes.update(id, updateObj, (err, item) => {
//   if (err) {
//     return next(err);
//   }
//   if (item) {
//     res.json(item);
//   } else {
//     next();
//   }
// });


// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust usters - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(function(item) {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(function(err) {
      next(err);
    });
});

// notes.create(newItem, (err, item) => {
//   if (err) {
//     return next(err);
//   }
//   if (item) {
//     res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
//   } else {
//     next();
//   }
// });


router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id)
    .then(function() {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

// notes.delete(id, err => {
//   if (err) {
//     return next(err);
//   }
//   res.sendStatus(204);
// });


module.exports = router;