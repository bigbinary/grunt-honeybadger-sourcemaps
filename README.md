# grunt-honeybadger-sourcemaps

> Plugin for uploading sourcemaps to honeybadger

See [this blog](https://blog.bigbinary.com/2018/07/16/how-to-upload-source-maps-to-honeybadger.html) for much more detailed information.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-honeybadger-sourcemaps --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-honeybadger-sourcemaps');
```

## The "honeybadger_sourcemaps" task

### Overview
In your project's Gruntfile, add a section named `honeybadger_sourcemaps` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  honeybadger_sourcemaps: {
    default_options: {
      options: {
        // Task-specific options go here.
      },
      your_target: {
        // Target-specific file lists and/or options go here.
      },
    }
  },
});
```

### Options

#### options.appId
Type: `String`

The API key of your Honeybadger project (see the API Key tab in project settings).

#### options.token
Type: `String`

The Honeybadger-Token can be used to authenticate requests from Honeybadger servers:

#### options.urlPrefix
Type: `String`

The URL of your minified JavaScript file in production. 

### options.prepareUrlParam
Type: `function`

A function to manipulate the file path.

### Usage Examples

#### Default Options
```js
grunt.initConfig({
  honeybadger_sourcemaps: {
    default_options:{
      options: {
        appId: "xxxx",
        token: "xxxxxxxxxxxxxx",
        urlPrefix: "http://example.com/",
        prepareUrlParam: function(fileSrc){
          return filesrc.replace('built/', '');
        }
      },
      files: [{
        src: ['@path/to/**/*.map']
      }],
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
