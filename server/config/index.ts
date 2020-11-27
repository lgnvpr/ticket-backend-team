import { localConfig } from "./LocalConfig"

const ENV = process.env.NODE_ENV 

var config = localConfig
if(ENV== "local"){
   config = localConfig 
}
else { 
    config = localConfig
}
export default config
