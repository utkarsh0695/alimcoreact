import { Navigate } from "react-router";
import { toast } from "react-toastify";

export const toCamelCase = (str) => {
  const words = str.split(" ");
  return words
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const playNotificationSound = () => {
  const audio = new Audio("../assets/audio/notification_sound_2.mp3"); // path to your audio file
  audio
    .play()
    .then(() => {
      console.log("Audio played successfully");
    })
    .catch((error) => {
      console.error("Failed to play the audio:", error);
    });
};

// logs out user by clearing out auth token in localStorage and redirecting url to /login page.
export const logoutAction = (msg) => {
  localStorage.clear();
  toast.error(msg);
  Navigate("/login");
};

export function ValidateImg(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    // File signature check
    const isPng = header === "89504e47"; // PNG signature
    const isJpeg =
      header === "ffd8ffe0" || // JPEG signature
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";

    const isValidImage = isPng || isJpeg;
    callback(isValidImage); // Pass the result to the callback function
  };
  reader.onerror = function () {
    callback(false); // In case of an error, return false
  };
  reader.readAsArrayBuffer(file.slice(0, 4)); // Read the first 4 bytes of the file
}

export function ValidateImgPdf(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    // File signature check
    const isPng = header === "89504e47"; // PNG signature
    const isJpeg =
      header === "ffd8ffe0" || // JPEG signature
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";
    const isPdf = header === "25504446";

    const isValidImage = isPng || isJpeg || isPdf;
    callback(isValidImage); // Pass the result to the callback function
  };
  reader.onerror = function () {
    callback(false); // In case of an error, return false
  };
  reader.readAsArrayBuffer(file.slice(0, 4)); // Read the first 4 bytes of the file
}
export function ValidatePdf(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    const isPdf = header === "25504446";
    const isValidImage = isPdf;
    callback(isValidImage); // Pass the result to the callback function
  };
  reader.onerror = function () {
    callback(false); // In case of an error, return false
  };
  reader.readAsArrayBuffer(file.slice(0, 4)); // Read the first 4 bytes of the file
}
export function ValidateExcel(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, "0"); // Ensure each byte is two characters
    }
    header = header.toUpperCase(); // Convert the header to uppercase
    const isXls = header === "D0CF11E0";
    callback(isXls); // Pass the result to the callback function
  };
  reader.onerror = function () {
    callback(false); // In case of an error, return false
  };
  reader.readAsArrayBuffer(file.slice(0, 4)); // Read the first 4 bytes of the file
}
export const validateExcel = (file, callback) => {
  const reader = new FileReader();

  // Check file extension first to eliminate .zip files
  const fileName = file?.name?.toLowerCase();
  const isXlsExtension = fileName?.endsWith(".xls");
  const isXlsxExtension = fileName?.endsWith(".xlsx");

  if (!isXlsExtension && !isXlsxExtension) {
    callback(false); // Invalid file if extension is not .xls or .xlsx
    return;
  }

  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, "0");
    }
    header = header.toUpperCase();

    // File signature check for Excel files
    const isXls = header === "D0CF11E0"; // XLS (Excel 97-2003)
    const isXlsx = header === "504B0304"; // XLSX (Excel Open XML format)

    // Combine both checks
    const isExcel = (isXls && isXlsExtension) || (isXlsx && isXlsxExtension);

    callback(isExcel); // Callback with true if it's a valid Excel file
  };

  reader.onerror = function () {
    callback(false); // Error while reading file
  };

  reader.readAsArrayBuffer(file.slice(0, 4));
};
export const validateExcelFile = (file) => {
  return new Promise((resolve) => {
    validateExcel(file, (isValid) => {
      resolve(isValid);
    });
  });
};
// Convert IST to ISO
export const istToISO = (istString) => {
  const istDate = new Date(istString); // Convert IST string to Date object
  const isoDate = istDate.toISOString(); // Convert to ISO format
  return isoDate; // Return ISO format Date object to be used in DatePicker
};

export function istToCustomFormat(istString) {
  const date = new Date(istString); // Create a Date object from the IST string

  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]; // Month names
  // const month = months[date.getMonth()]; // Get month name from the array
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear(); // Get full year

  let hours = date.getHours(); // Get hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad with leading zero if needed
  const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM
  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`; // Return in dd-Mon-yyyy h:mm AM/PM format
}

export const filterByTicketId = (ticketId, data) => {
  return data.filter((item) => item.ticket_id === ticketId);
};
