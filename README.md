# The perfect starter template for React Native: Expo, Tailwinds(Nativewind), React Native Paper UI and Prettier
### Introduction

Setting up a new React Native project can be a daunting task, especially when it comes to configuring the tools and libraries that you need for a smooth and efficient workflow. In this guide, we'll show you how to configure a React Native project with Expo, Tailwind, React Native Paper, and Prettier. Expo will provide a powerful development environment, Tailwind will give you a flexible and easy-to-use styling solution, React Native Paper will provide a comprehensive set of UI components, and Prettier will help you maintain consistent code formatting. By the end of this guide, you'll have a fully configured project that's ready for success.

In this post, I'll show you how I configured my current template starter for my projects. I'll let the link to the repository at the end of this article!

![KUNG FU PANDA 3 All Movie Clips (2016) - YouTube](https://i.ytimg.com/vi/fkorWPoi6E0/maxresdefault.jpg)

### Prerequisites

There are some installments we need to have to start with this journey as stated on the [official Expo website](https://docs.expo.dev/get-started/installation/):

*   [Node LTS release](https://nodejs.org/en/)
    
*   [Git](https://git-scm.com/)
    
*   [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) is only for Mac/Linux users
    

They recommend (and so do I 😎) using the [VSCode editor](https://code.visualstudio.com/) & the [VSCode Expo extension](https://marketplace.visualstudio.com/items?itemName=byCedric.vscode-expo).

Also, it is recommended to install the Expo GO native application for your phone. I'll let you the link for [iPhone](https://apps.apple.com/us/app/expo-go/id982107779) & [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=es_MX).

> _When you run_ `npx expo start` _in your project,_ [_Expo CLI_](https://docs.expo.dev/workflow/expo-cli/) _starts a_ [_development server_](https://docs.expo.dev/workflow/expo-cli/#develop) _and generates a QR code. You can then open the Expo Go app on your device and scan the QR code to connect to the dev server._
> 
> _The dev server returns a JSON manifest file that describes the project. Expo Go uses this manifest to download the JavaScript bundle and any assets required to run the project. Then, the_ [_JavaScript engine_](https://docs.expo.dev/more/glossary-of-terms/#javascript-engine) _executes this JavaScript bundle to render the React Native app._

![Expo Go connecting to Expo CLI](https://docs.expo.dev/static/images/fetch-app-development.png)

### Creating a new project

Now, let's create a brand new project:

```

npx create-expo-app my-app

cd my-app

yarn expo start

```


After the latest command, you should get this a log like this one in your console:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1683049534192/f693973a-64c5-4adb-a3d6-6102e79e2f1c.png?auto=compress,format&format=webp)

Now you can link your development environment with your Expo Go app by clicking on the scan the QR code option inside the app.

### Setting up Tailwinds CSS with Nativewind

For the integration of Tailwinds inside our RN Expo project we'll be using [the Nativewind library](https://github.com/marklawlor/nativewind/tree/main/packages/nativewind).

> `NativeWind` uses [Tailwind CSS](https://tailwindcss.com/) as a high-level scripting language to create a **universal design system**.

So, let's install it!

```
yarn add nativewind
yarn add --dev tailwindcss

```


Then, you should configure your tailwind config file as per your requirements:

```


module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

```


and add the _Nativewind_ plugin in the babel config file too:

```

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
+   plugins: ["nativewind/babel"],
  };
};

```


With this you'll be good to go:

```
import { StatusBar } from 'expo-status-bar';
import React from 'react';
- import { StyleSheet, Text, View } from 'react-native';
+ import { Text, View } from 'react-native';

export default function App() {
  return (
-   <View style={styles.container}>
+   <View className="flex-1 items-center justify-center bg-white">
-     <Text>Open up App.js to start working on your app!</Text>
+     <Text>Tailwinds is up now!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

- const styles = StyleSheet.create({
-   container: {
-     flex: 1,
-     backgroundColor: '#fff',
-     alignItems: 'center',
-     justifyContent: 'center',
-   },
- });

```


### Setting up React Native Paper UI

To add [RN Paper UI](https://callstack.github.io/react-native-paper/) to our project just follow these steps:

```
yarn add react-native-paper

yarn add react-native-safe-area-context

yarn add react-native-vector-icons

```


Now, let's add the plugin to the Babel config file:

```

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
-   plugins: ['nativewind/babel'],
+   plugins: ['nativewind/babel', 'react-native-paper/babel'],
  }
}

```


That's it, from here let's just configure inside our layout for example:

```
...
+ import { Provider as PaperProvider } from 'react-native-paper'

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <>
+     <PaperProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='modal' }} />
          </Stack>
        </ThemeProvider>
+     </PaperProvider>
    </>
  )
}

```


Example of use:

```
import * as React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const MyComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} />
);

export default MyComponent;

```


![](https://callstack.github.io/react-native-paper/screenshots/activity-indicator.gif)

### Setting up Prettier

Setting the environment up with prettier is straightforward, just create a couple of files:

```

{
    "trailingComma": "es5",
    "tabWidth": 2,
    "semi": false,
    "singleQuote": true,
    "printWidth": 100,
    "endOfLine": "lf",
    "sqlKeywordCase": "lower",
    "jsxSingleQuote": true,
    "jsxBracketSameLine": false
}

```


```

.expo
node_modules
package-lock.json
docker*

```


These two files will vary depending on your requirements. So, feel free to play with them as your project grows.

Note: it is also important to have the Prettier VSCode extension installed and activated to this configuration works as expected.

### Wrap up!

*   Expo is a powerful development environment that can make it easier to build and test your React Native app across different platforms.
    
*   Tailwind is a flexible and easy-to-use CSS utility library that can speed up your development process by allowing you to style your components more efficiently.
    
*   React Native Paper is a comprehensive set of UI components that can help you build a beautiful and consistent user interface.
    
*   Prettier is a code formatting tool that can help you maintain consistent formatting across your project and save you time and effort.
    
*   As your project grows and evolves, you may need to make changes to your configuration to adapt to new requirements and technologies, so it's important to stay up-to-date with the latest tools and best practices.
    

### Bonus

This article sums up the steps I followed to create this template. You can find its repository in this [link](https://github.com/aiherrera/react-expo-template). Feel free to use it and give some feedback!

Stay tuned!