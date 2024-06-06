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
