function errorBag(errors) {

    let errorsBag = {}
    let errorDetails = errors.details

    errorDetails.forEach(function (error, index) {
        let errorKey = error.path[0];
        let message = error.message;
        message = message.replace(/"|"/g, '');
        message = message.replace(/"|_/g, ' ');
        message = message[0].toUpperCase() + message.slice(1).toLowerCase();
        if (index == 0) {
            errorsBag['message'] = message;
        }
        errorsBag[errorKey] = message;
    })
    //return errorDetails;
    return errorsBag;
}


export {errorBag}