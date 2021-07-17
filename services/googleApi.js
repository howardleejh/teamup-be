'use strict'

const axios = require('axios')

module.exports = {
  googApi: async (input) => {
    let destination = null

    try {
      destination = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        {
          params: {
            query: input,
            key: process.env.GOOG_API,
          },
        }
      )
      return destination
    } catch (err) {
      return err
    }
  },
}
