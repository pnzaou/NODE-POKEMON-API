const { Pokemon } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', auth, (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Pokemon.findByPk(id).then(pokemon => {
        if(pokemon === null) {
          const message = 'Le pokemon n\'existe pas. Réessayez avec un autre identifiant'
          return res.status(404).json({message})
        }
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
    })
    .catch(err => {
      if(err instanceof ValidationError){
        return res.status(400).json({message: err.message, data: err})
      }
      if(err instanceof UniqueConstraintError) {
        return res.status(400).json({message: err.message, data: err})
      }
      const message = `Le pokemon n'a pas pu etre modifié. Réessayez dans quelques instqnts.`
      res.status(500).json({message, data: err})
    })
  })
}