import { ValidationError } from "joi";

interface ErrorBag {
  message?: string;
  [key: string]: string | undefined;
}

export default function errorBag(errors: ValidationError): ErrorBag {
  const errorsBag: ErrorBag = {};

  const errorDetails = errors.details;

  errorDetails.forEach((error, index) => {
    const errorKey = error.path?.[0] as string;
    let message = error.message;

    message = message.replace(/["|]/g, "");
    message = message.replace(/[_]/g, " ");
    message =
      message.charAt(0).toUpperCase() +
      message.slice(1).toLowerCase();

    if (index === 0) {
      errorsBag.message = message;
    }

    errorsBag[errorKey] = message;
  });

  return errorsBag;
}