const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
  
module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    if(req.query.name) {
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5 //recuperation dynamique de la valeur de la limite sinon mettre la limite à 5
      if (name.length < 2) {
        const message = 'Le terme de recherche doit contenir au minimum 2 caractères'
        res.status(400).json({message})
      } else {
        return Pokemon.findAndCountAll({ //findAndCountAll permet de rechercher et aussi de compter le nombre de resultat. ici on recherche par rapport au nom on renvoie les 5 premiers resultats ainsi que le nombre total de pokemon
          where: {
            name: { // 'name' est la propriété du modèle pokémon
              [Op.like]: `%${name}%` // 'name' est le critère de la recherche et on rechere tous les pokémons dont le nom contient la valeur de 'name'
            }
          },
          order: ['name'], //ordonne le resultat via le nom des pokemons par ordre croissant
          limit: limit //limite les resultats de la recherceh par rapport à ka variable limit declarée plus haut
        })
          .then(({count, rows}) => {
            const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}`
            res.json({message, data: rows})
          })
      }
    } else {
      Pokemon.findAll({order: ['name']})
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(err => {
        const message = `La liste des pokemons n'a pas pu etre récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data: err})
      })
    }
  })
}