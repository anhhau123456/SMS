const accountSid = 'AC10f2c0ea6d015fcf169f4f6d47a1d529';
const authToken = '60fe634e95be906e5b201d149a682797';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: '123123',
        from: '+19787182234',
        to: '+84935212713'
    })
    .then(message => console.log(message));