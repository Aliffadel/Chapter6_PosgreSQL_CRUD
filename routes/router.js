const express = require('express')
const router = express.Router()
const { Users, Biodata, History } = require('../models')

// untuk mendapatkan seluruh data user
router.get('/api/users', async (req, res, next) => {
  try {
    const userList = await Users.findAll({
      // include berfungsi untuk join table sesuai dengan alias (AS) yang sudah didefinisikan di relasi yang ada di file index
      include: ['user_game_biodata', 'user_game_history']
    })
    res.status(200).json({
      message: "SUCCESS",
      data: userList
    })
  } catch (error) {
    next(error)
  }
})
// untuk mendapatkan seluruh data kucing
router.get('/api/user_game_biodata', async (req, res, next) => {
  try {
    const biodataList = await Biodata.findAll({
      include: ['users']
    })
    res.status(200).json({
      message: "SUCCESS",
      data: biodataList
    })
  } catch (error) {
    // teruskan error ke middleware yang handle error
    next(error)
  }
})

// create user
router.post('/api/users', async (req, res, next) => {
  console.log (req.body)
  const { email, password, name, hobby, age, win, lose } = req.body
  // operasi create ini sama dengan
  // INSERT INTO "users" ("uuid","name","email","hobby","status","is_active","age","createdAt","updatedAt") 
  // VALUES (uuid, name, email, hobby,status,is_active,age, createdAt, updatedAt) RETURNING 
  // "uuid", "name", "email", "hobby", "status", "is_active", "age", "createdAt", "updatedAt";
  try {
    const newUser = await Users.create({
      email: email,
      password
    })

    await Biodata.create({
      name: name,
      hobby: hobby,
      age: age,
      user_uuid: newUser.uuid
    })
    
    await History.create({
      win: win,
      lose: lose,
      user_uuid: newUser.uuid
    })

    if (newUser) {
      res.status(201).json({
        message: "SUCCESS",
        data: newUser
      })
    } else {
      res.status(400).json({
        message: "FAILEd"
      })
    }
  } catch (error) {
    next(error)
  }

})

// get edit users
router.get('/api/users/:id', async (req, res, next) => {
  try {
    const userGame = await Users.findOne({
      where: {uuid: req.params.id},
      include: ['user_game_biodata', 'user_game_history']
  })
  res.status(200).json({
    message: "SUCCESS",
    data: userGame
  })
} catch (error) {
  next(error)
}
})

// edit users
router.put('/api/users/:id', async (req, res, next) => {
  const { email, password, name, hobby, age, win, lose} = req.body
  try {
    // ini bentuk panjang
    // await Users.findOne({
    //   where: {
    //     uuid: req.params.id
    //   }
    // })
    const userToUpdate = await Users.findByPk(req.params.id)
    // jika user yang akan di edit ditemukan
    if (userToUpdate) {
      const biodataToUpdate = await Biodata.findOne({
        where: {
          user_uuid: req.params.id
        }
      })
      const updatedBiodata = await biodataToUpdate.update({
        name: name,
        hobby: hobby,
        age: age
      })
      const historyToUpdate = await History.findOne({
        where: {
          user_uuid: req.params.id
        }
      })
      const updatedHistory = await historyToUpdate.update({
        win: win,
        lose: lose
      })
      const updated = await userToUpdate.update({
        // kalau name dari body ada pakai name dari body, kalau tidak pakai name yang sebelumnya sudah ada di db
        email: email ?? userToUpdate.email,
        password: password ?? userToUpdate.password,

      })
      res.status(200).json({
        message: "SUCCESS",
        data: updated, updatedBiodata, updatedHistory
      })
    } else {
      res.status(404).json({
        message: "user not found"
      })
    }
  } catch (error) {
    next(error)
  }

})

// delete user
router.delete('/api/users/:id', async (req, res, next) => {
  try {

    const userToDelete = await Users.findByPk(req.params.id)
    // jika user yang akan di edit ditemukan
    if (userToDelete) {
      // delete anaknya dulu baru ortunya
      await Biodata.destroy({
        where: { user_uuid: req.params.id }
      })
      await History.destroy({
        where: { user_uuid: req.params.id }
      })
      // bentuk sql nya  DELETE FROM "users" WHERE "uuid" = '29b37eb8-8509-498e-837d-db57d8ee2617'
      const deleted = await Users.destroy({
        where: {
          uuid: req.params.id
        }
      })
      // kalau deleted nya sama dengan angka 1 berarti berhasil
      console.log(deleted)
      res.status(200).json({
        message: "SUCCESS",
      })
    } else {
      res.status(404).json({
        message: "user not found"
      })
    }
  } catch (error) {
    next(error)
  }

})



module.exports = router