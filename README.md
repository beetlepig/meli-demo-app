# Mercado Libre demo app

This application utilizes the official Mercado Libre API to recreate a basic version of the official application.

The project was developed using [**Remix**](https://remix.run), a full-stack React framework chosen for its suitability for this demo's requirements, including SEO and performance.

Remix provides us with **SSR** capabilities, which are ideal for enhancing SEO and performance. It allows for server-only code execution, making it suitable for backend tasks such as database interaction or managing sensitive information. Additionally, it offers a client-side rich UI powered by React.

## Insights:

- This application was designed to function seamlessly with or without **JavaScript**. This means that even in unfavorable network conditions or environments where JavaScript is restricted, the application will continue to operate.
- The HTML was carefully crafted with consideration for screen readers and other accessibility requirements. **Semantic HTML** tags and accessibility properties were included to ensure an accessible user experience for all users.
- All network requests to the MELI API were **parallelized** whenever possible, taking advantage of the **HTTP/2 multiplexing** feature. This led to a substantial improvement in network latency and response time.
- The product details are prefetched when the user hovers over a product in the product list. This enables instantaneous navigation to the product details page in many cases.
- This application was architected using a frontend-adapted version of the **clean architecture**, with the UI part following the principles of **atomic design**. This approach ensures excellent scalability as the application grows.

# Getting started

*This application requires node.js 18 or up installed.*

To begin, ensure that you have installed the necessary npm packages.

    npm install

Next, you'll need to create an `env` file. This is only used as a dummy demonstration of the environment variables in a Remix app.

1.  Create a .env file in the root folder.
2.  Use the `.env.example` as a template for this file. You can simply copy the contents of this file into the `.env` file and modify the variable values if necessary.

Finally, you can run the application in dev mode by running the following

    npm run dev

Once started, a development server should be running at `http://localhost:5173/` (check your terminal in case the URL have changed).

# Architecture

## Clean Architecture

An adapted version of the clean architecture was utilized to organize this project, drawing inspiration from various sources including [articles](https://indiedev.medium.com/clean-architecture-in-frontend-react-redux-typescript-bd108ddd13f7) and lectures on the topic.

The layers were structured to adhere to the separation of concerns principle, as well as the dependency rule. Here's a brief overview of the created layers and folders.

- **Domain Layer**: This layer has no dependencies and contains the **entities** and their associated enterprise business rules. In our application, the `models` folder hosts the entities and their rules, typically defined using [Zod](https://zod.dev) validation schemas and typescript interfaces. We use the `models` folder for this.
- **Infrastructure Layer**: This layer contains the **use cases** and **services**. The use cases take a part in the 'loaders' and 'actions' as they represent state changes or data flows according to the business rules. For example, a use case could involve a user searching for an item and receiving a list of items in response. This behavior is could be implemented in a portion of the Remix loader by calling a service to retrieve the items. We use the `services` folder for this.
- **Adapters Layer**: This layer is responsible for adapting the data from the infrastructure layer to be presented reliably. In our application, we adapt the data retrieved from the MELI API into a simpler object format that is used in the presentation layer (UI). We use the `adapters` folder for this.
- **Presentation Layer**: In this layer, we utilize a web UI built with React. We receive data from the adapter layer and present it to the user. Additionally, this layer follows its own sub-architecture based on atomic design principles, enhancing composability and reusability. We use the `components` folder for this.

## Atomic Design

Atomic Design is a design methodology utilized to construct design systems in a composable, consistent, and methodical manner. These principles align seamlessly with React development, as React components can be structured and organized according to this methodology, allowing for greater flexibility and consistency in UI development.

These UI layers also adhere to the dependency rule, which means that lower-level UI components cannot access higher-level ones. This ensures a clear and structured separation of concerns within the UI architecture.

Those are the concepts used to implement atomic design in the presentational (UI) layer.

-  **Atoms**: Representing the smallest UI components, atoms are typically indivisible and are visual-only components. They are located within the `atoms` folder inside the `components` directory.
- **Molecules**: A mid-size UI element, it has one or mode atoms in it and is visual-only as well. We can find those in the `molecules` folder.
-   **Organisms**: These are larger UI components that may consist of atoms and molecules in their composition. Organisms can incorporate light logic and represent complex pieces of UI. They are located within the `organisms` folder.
- **Layout**: This layer does not have a direct visual representation and can be utilized by any component. It primarily consists of structural elements such as margin boxes or similar utilities. Layout components are located within the `layout` folder.


# Testing

Testing was implemented using [playwright](https://github.com/microsoft/playwright), an E2E testing framework, to run the tests, do the following.

1. Install playwright components: `npm run playwright:install`
2. Run the tests: `npm run test`
3. If you want to run the ui mode, run the following: `npm run test -- --ui`

## Deploy
*The demo was already deployed, visit: [meli-demo-app.vercel.app](https://meli-demo-app.vercel.app/ "https://meli-demo-app.vercel.app")*

The application was configured to deploy to [Vercel](https://vercel.com), so the `@vercel/remix` package was installed to ensure compatibility, the npm scripts were modified to continue working in both, dev and production builds.

Some analytics scripts from Vercel were added, such as [Analytics](https://vercel.com/analytics) and [SpeedInsights](https://vercel.com/docs/speed-insights).
