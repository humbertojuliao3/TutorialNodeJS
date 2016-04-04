// module.export eh necessario para ser usado no require do app.js
module.exports = {
    // substitua o valor pelo nome do seu container no CloudKit Dashboard
    containerIdentifier: 'iCloud.NoobSoft.CloudKitTutorial'
    ,  
    environment: 'development'
    ,  
    serverToServerKeyAuth: {
        // Insira aqui a chave gerada no CloudKit Dashboard
        keyID: 'b27aed7d0850ecfd3281680f1932875cbc5db78bd86891d1341833d26ac538bf'
        ,  
        // deve apontar para o diretório/arquivo da chave gerada em sua maquina (key ID).
        privateKeyFile: __dirname + '/eckey.pem'
    }
};