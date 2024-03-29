export class User {
  constructor(
    public email: string,
    public id: string,
    public name: string,
    private _token: string,
    private _tokenExpirationDate?: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export class UserSettings {
  userId: string;
  favourites: string[];
  diet: string;
  theme: string;
}
