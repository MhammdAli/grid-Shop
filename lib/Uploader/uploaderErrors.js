export const UPLODAER_ERRORS = {
    FILE_NOT_ACCEPTED : "FILE_NOT_ACCEPTED",
     
}

 
export function isUploaderError(error){ 
    return Boolean(UPLODAER_ERRORS[error?.name])   
}