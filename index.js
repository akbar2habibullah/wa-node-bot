const qrcode = require('qrcode-terminal')
const os = require('node:os')
const { Client } = require('whatsapp-web.js')
const client = new Client({
	authStrategy: new LocalAuth(),
})

const specialOsMsg = os.platform() === 'win32' ? "just playing games so there's no notification yet on the screen" : 'just focusing himself to learn some random software engineering documentation on the internet or simply cook something in the kitchen'
const specialContact = ['Aziz', 'Fajar', 'Dadan']

let msgHistory = {}
let liveStatus = true

client.on('qr', (qr) => {
	qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
	console.log('Client is ready!')
})

client.on('message', async (message) => {
	const chat = await message.getChat()
	console.log(message)
	console.log(chat)

	if (!chat.isGroup) {
		if (!msgHistory.hasOwnProperty(chat.name)) {
			msgHistory[chat.name] = [message]
			setTimeout(() => {
				delete msgHistory[chat.name]
			}, 3600000)
			if (specialContact.includes(chat.name)) {
				message.reply(`You get this special automated message because you are listed as '${chat.name}' in Habib's contact list. This message was sent from Habib's ${os.platform() === 'win32' ? 'windows' : 'linux'} laptop, so he is probably away from the keyboard or ${specialOsMsg}. If there's anything quite urgent to talk about, just directly call him anyway. You only get this message once and this bot could respond again in an hour to prevent spam messages.`)
				client.sendMessage(message.from, "If you're interested to learn how to make this message without paying for cloud infrastructure or WhatsApp business like him, you can follow this link https://wwebjs.dev/ - Habib's WA Bot")
			} else {
				message.reply(`This is an automated message from Habib's ${os.platform() === 'win32' ? 'windows' : 'linux'} laptop. He is probably away from the keyboard. Just directly try to call him if there's anything urgent to talk about. You only get this message once and this bot could respond again in an hour to prevent spam messages.`)
				client.sendMessage(message.from, "If you're interested to learn how to make this message without paying for cloud infrastructure or WhatsApp business like him, you can follow this link https://wwebjs.dev/ - Habib's WA Bot")
			}
		} else {
			msgHistory[chat.name].push(message)
		}

		if (chat.name === 'ME 2nd') {
			if (message.body === '!stop') liveStatus = false
			if (message.body === '!start') liveStatus = true
			console.log(liveStatus)
		}
	}
})

client.initialize()
