# [Not Twitter](https://not-twitter-ulu.vercel.app/)

Not Twitter is a simple social media application that allows users to post short messages, follow other users, and view their feeds. It is built using the MERN stack, which stands for MongoDB, Express, React, and Node.js.

## Getting started

To get started with the project, follow these steps:

1. Clone the repository using Git:

```
git clone https://github.com/UlukbekM/not-twitter.git
```

2. Install the dependencies by running the following command in the project directory:

```
npm install
```

3. Create `.env` files in the project client and server directory with the following variables:
```
REACT_APP_AWS_ACCESSKEY_ID = awsaccesskey
REACT_APP_AWS_SECRET_ACCESSKEY = awssecretkey
REACT_APP_BUCKET_NAME = awsbucketname
REACT_APP_REGION = awsregion
REACT_APP_BACKEND_API = apilink
```


```
REACT_APP_MONGODB=mongodbsecret
JWT_TOKEN_KEY=jwtsecret
```

4. Start the development server by running the following command:

```
npm run dev
```

This will start the server on `http://localhost:3000`.

## Usage

The application includes a simple UI built using React. You can use this to create an account, log in, post messages, follow other users, and view your feed.

The server-side code is located in the `server` directory, and the client-side code is located in the `client` directory. You can modify these files to customize the application to your needs.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! If you find a bug or want to add a feature, please create an issue or submit a pull request.