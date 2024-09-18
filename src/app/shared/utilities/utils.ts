export class Utils {

  static phoneRegex = /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/;

  static emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  static zipcodeRegex = /^\d{5}$/;

  static passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  static decimalNumberRegex = /^(\d*\.)?\d+$/;

  static priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Pattern for only upto 2 decimal places

  static urlRegex = /https?:\/\/.+/;

  static onKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

}
