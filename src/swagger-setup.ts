import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import simpleGit from 'simple-git'
import { getThemeAsync } from "@intelika/swagger-theme"


export async function setupDocument(app: INestApplication, route: string) {
    const git = simpleGit({
        baseDir: process.cwd(),
        binary: 'git'
    })

    const lastCommitFromLocal = await git.log(['-1'])

    const { date, author_name, message } = lastCommitFromLocal.latest
    const updatedAt = new Date(date).toUTCString()

    const description = [`🤖 Noghte Khat API`]
    description.push(`📅 Updated: <b>${updatedAt}</b>`)
    description.push(`👤 Last commit by  <b>${author_name}</b>`)
    description.push(`📝 Summary: <i>${message}</i>`)

    description.push(` --- `)
    description.push('✅ 2XX,3XX:')
    description.push(`
         {
              "statusCode": number
              "success": boolean
              "message": string | null
              "data": T | null
         }
    `)

    description.push('❌ 4XX,5XX:')
    description.push(`
         {
                "statusCode": number
                "success": boolean
                "message": string
         }
        `)

    const configDocument = new DocumentBuilder()
        .setTitle('noghte khat')
        .setDescription(description.join('\r\n\r\n'))
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'Bearer',
            bearerFormat: 'JWT'
        })
        .build()
    const style = await getThemeAsync()
    const document = SwaggerModule.createDocument(app, configDocument)
    SwaggerModule.setup(route, app, document, {
        customCss: style.toString()
    })
}
