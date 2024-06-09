const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/Pokemon')
const UserModel = require('../models/User')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')

let sequelize

if(process.env.NODE_ENV === 'production'){
  sequelize = new Sequelize('j6azts68cqkt8cgc', 'c36llrn69z75eomq', 'g377ggg0pub306mf', {
    host: 'iu51mf0q32fkhfpl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  }) 
} else {
  sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: false
  })
}
  
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
  
const initDb = () => {
  return sequelize.sync().then(_ => {
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types
      }).then(pokemon => console.log(pokemon.toJSON()))
    })

    bcrypt.hash('test123', 10) //permet d'encrypter le mdp
    .then(hash => User.create({ username: 'Enz', password: hash}))
    .then(user => console.log(user.toJSON()))

    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { 
  initDb, Pokemon, User
}