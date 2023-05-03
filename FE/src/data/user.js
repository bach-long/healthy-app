import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("ui.db");

export const createTableAuthUsers = () => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE table if not EXISTS auth_users (
        	id INTEGER PRIMARY KEY AUTOINCREMENT,
          token text not null,
          user_id int not null,
          username text not null,
          avatar text not null
        );`,
        [],
        () => console.log("create table auth_users success"),
        (error) => console.log("Error create table user: ", error)
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const insertUser = (authUser) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO auth_users (token, user_id, username, avatar)
              VALUES ("${authUser.token}", ${authUser.id}, "${authUser.username}", "${authUser.avatar}");`
        );
      },
      [],
      () => {
        resolve("insert success");
      },
      (error) => {
        reject("Error insert user:" + error.message);
      }
    );
  });
};

export const getAuthUserProperty = (property) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select ${property} from auth_users limit 1;`,
          [],
          (transact, resultset) => {
            resolve(resultset?.rows?._array);
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const droptTable = (nameTable) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE ${nameTable}`,
        [],
        () => console.log("drop success"),
        (error) => console.log(error)
      );
    });
  } catch (error) {
    console.log(error);
  }
};