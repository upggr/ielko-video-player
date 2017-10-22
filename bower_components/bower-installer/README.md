bower-installer [![Build Status](https://travis-ci.org/rquadling/bower-installer.png?branch=master)](https://travis-ci.org/rquadling/bower-installer)
===============

Tool for installing bower dependencies that won't include entire repos. Although Bower works great
as a light-weight tool to quickly install browser dependencies, it currently does not provide much
functionality for installing specific "built" components for the client.

# Bower installs entire repositories

```json
{
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "backbone": "latest"
    }
}
```
If `bower install` is run on this configuration file, the entire backbone repository will be pulled down
and copied into a components directory. This repository is quite large, when probably only a built js and css
file are needed.  Bower conveniently provides the `bower list --paths` command to list the actual main files associated
with the components (if the component doesn't define a main, then the whole repository is listed instead).

# Bower Installer
Bower installer provides an easy way for the main files to be installed or moved to one or more locations. Simply add to
your bower.json an `install` key and `path` attribute:

```json
{
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "backbone": "latest"
    },
    "install": {
        "path": "some/path"
    }
}
```

Install bower-installer by executing

```bash
npm install -g bower-installer
```

From the terminal in the same directory as your bower.json file, enter:
```bash
bower-installer
```

After executing this, `backbone.js` will exist under `some/path` relative to the location of your
bower.json file.

# Overriding main files
A lot of registered components for bower do not include bower.json configuration. Therefore, bower does not know
about any "main files" and therefore, by default bower-installer doesn't know about them either. Bower-installer
can override an existing main file path or provide a non-existant one:

```json
{
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "backbone": "latest",
        "requirejs": "latest"
    },
    "install": {
        "path": "some/path",
        "sources": {
            "requirejs": "bower_components/requirejs/require.js"
        }
    }
}
```
If bower installer is run on this configuration, `require.js` and `backbone.js` will all appear under
`some/path` relative to your bower.json file. 

# Install multiple main files
For one reason or another you may want to install multiple files from a single component. You can do this by providing
an `Array` instead of a `String` inside the sources hash. Or you can use file matchers [https://github.com/isaacs/minimatch](https://github.com/isaacs/minimatch):

```json
{
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "jquery-ui": "latest",
        "datejs": "*"
    },
    "install": {
        "path": "some/path",
        "sources": {
            "jquery-ui": [
            "bower_components/jquery-ui/ui/jquery-ui.custom.js",
            "bower_components/jquery-ui/themes/start/jquery-ui.css"
            ],
            "datejs": "bower_components/datejs/build/*.*"
        }
    }
}
```

# Install files to multiple locations
Files can be installed to multiple locations based upon file type or regular expression. Do so by modifying the `path` to be a map of file-type
locations. Example:
```json
{
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "jquery-ui": "latest"
    },
    "install": {
        "path": {
            "css": "src/css",
            "js": "src/js",
            "/[sc|le]ss$/": "src/css"
        },
        "sources": {
            "jquery-ui": [
            "bower_components/jquery-ui/ui/jquery-ui.custom.js",
            "bower_components/jquery-ui/themes/start/jquery-ui.css"
            ]
        }
    }
}
```

# Configurable paths
Paths can be custom configurable with variables (key, name and version):
```json
{
    "name": "test",
    "version": "0.0.2",
    "dependencies": {
        "bootstrap": "~3.0.3"
    },
    "install": {
        "base":  "build",
        "path": {
            "js": "{name}/js",
            "css": "{name}/css",
            "eot": "{name}/fonts",
            "svg": "{name}/fonts",
            "ttf": "{name}/fonts",
            "woff": "{name}/fonts"
        }       
    }
}
```

Will create this output structure:
```
build/
    bootstrap/
        js
        css
        fonts
    jquery
        js
```

# Rename files during copy
Files can be renamed when bower-installer is copying them to their new destination. Do so by modifying the `mapping` object. Example:
 ```json
 {
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "jquery-ui": "latest"
    },
    "install": {
        "path": "some/path",
        "sources": {
            "jquery-ui": {
                "mapping": [
                {"bower_components/jquery-ui/ui/jquery-ui.js": "jquery-ui.js"},
                {"bower_components/jquery-ui/ui/minified/jquery-ui.min.js": "jquery-ui-min-new-name.js"}
                ]
            }
        }
    }
}
```

# Ignore files
Files can be ignored and not copied. Do so by adding the appropriate  to the `ignore` array. In the following example,
`ember-model` has as dependency on `ember` and `handlebars`, so normally `ember` and the `handlebars` js files would be copied but in this case we don't want them copied over.
Example:
 ```json
 {
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "ember-model": "0.0.8"
    },
    "install": {
        "path": "build/src",
        "ignore": ["ember", "handlebars"]
    }
}
```

# Benefits from glob patterns
You can specify a folder and get all files inside it preserving its folder structure.
Example:
```json
{
    "name": "test",
    "version": "0.1",
    "dependencies": {
        "datatables-bootstrap3": "latest"
    },
    "install": {
        "path": {
            "scss": "build/styles",
            "js": "build/js"
        },
        "sources": {
            "datatables-bootstrap3": "bower_components/datatables-bootstrap3/BS3/assets/**"
        }
    }
}
```

# Mapping folders
Entire folders can be mapped.
Example:
```json
{
  "name": "test",
  "version": "0.10",
  "dependencies": {
    "jquery-ui": "latest"
  },
  "install": {
    "path": "build/src",
    "sources": {
      "jquery-ui": {
        "mapping": [
          {"bower_components/jquery-ui/themes/base/**": "base"},
          {"bower_components/jquery-ui/jquery-ui.min.js": "jquery-ui.min.js"}
        ]
      }
    }
  }
}
```

will result in 
```
build/src/jquery/jquery.js
build/src/jquery-ui/jquery-ui.min.js
build/src/jquery-ui/base/*
```

where `build/src/jquery-ui/base/*` contains the CSS and JS for the base theme.

# Excluding package name from destination folder
The package name can be excluded from the `path`.
Example:
```json
{
  "name": "test",
  "version": "0.10",
  "dependencies": {
    "jquery-ui": "latest"
  },
  "install": {
    "options": {
      "includePackageNameInInstallPath": false
    },
    "path": "build/src",
    "sources": {
      "jquery-ui": {
        "mapping": [
          {"bower_components/jquery-ui/themes/base/**": "base"},
          {"bower_components/jquery-ui/jquery-ui.min.js": "jquery-ui.min.js"}
        ]
      }
    }
  }
}
```

will result in 
```
build/src/jquery.js
build/src/jquery-ui.min.js
build/src/base/*
```

where `build/src/base/*` contains the CSS and JS for the base theme.
