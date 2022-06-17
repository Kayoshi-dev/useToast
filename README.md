<h3 align="center">
  UseToast
</h3>

<p align="center"> Under heavy development!</p>

---

## How to install

    npm i @kayoshi-dev/usetoast

## Documentation

The useToast library allow you to display toast messages easily.

To get started, you need to import the useToast function from the library.

    import { useToast } from '@kayoshi-dev/usetoast';

Then you need to use the useToast function to access the createToast function, and you can extract that function like that :

    const { createToast } = useToast();

This function allow you to create a toast message, it takes a message, a type, an icon and a duration as parameters.

    createToast('Hello world', 'success', '<i class="bi bi-alarm"></i>', 5000);

For the moment, the type parameter can be one of the following :

- success
- info
- error

You can give any icon you want to the createToast function.

## Use with SSR

If you want to use the useToast library in an SSR environment, you might need to dynamically import the library :

    const useToast = (await import('@kayoshi-dev/usetoast')).default

## Contributing

If you're interested in contributing to the project, feel free to submit a pull request explaining what you're adding to the code.
