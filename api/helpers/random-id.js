const characters = '9abcde0fghijklm1nopqrs2tuvwxy3zABCDE4FGHIJKL5MNOPQ6RSTUVW7XYZ8';

module.exports = {


  friendlyName: 'Random ID',


  description: 'Random ID',


  inputs: {
    l: {
      type: 'number',
      required: true
    }
  },


  fn: async function (inputs) {
    let res = '';
    for (let i = 0; i < inputs.l; i++ ) {
      res += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return res;
  }


};

