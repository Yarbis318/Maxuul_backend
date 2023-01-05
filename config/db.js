import mongoose from "mongoose"

const conectarDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		)

		const url = `${connection.connection.host}:${connection.connection.port}`
		console.log(`Mongo DB Conectado en: ${url}`)
	} catch (error) {
		console.log(`error: ${error.message}`)

	}
}

export default conectarDB
