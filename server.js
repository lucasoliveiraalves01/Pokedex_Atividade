const express = require('express');
const axios   = require('axios');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/pokemon/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
        const response = await axios.get(url);
        const pokemon = response.data;

        const dados = {
            home:       pokemon.name,  // usado no front-end
            id:         pokemon.id,
            tiposHTML:  pokemon.types.map(t => t.type.name),
            altura:     (pokemon.height / 10) + ' m',
            peso:       (pokemon.weight / 10) + ' kg',
            imagem:     pokemon.sprites.other['official-artwork'].front_default,
            habilidades: pokemon.abilities.map(a => a.ability.name),
        };

        res.json(dados);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ erro: 'Pokémon não encontrado!' });
        } else {
            res.status(500).json({ erro: 'Erro ao conectar com a PokeAPI.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});