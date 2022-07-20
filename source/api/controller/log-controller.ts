export class LogController {
  static writeLog(message: string, ex: any) {
    if (typeof ex === "string") {
      message += `${ex.toUpperCase()}`;
    } else if (ex instanceof Error) {
      message += `${ex.message}`;
    }
    console.log(message);
  }
}
