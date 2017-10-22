# Change Log
All notable changes to this project will be documented in this file.

## 1.3.6 - 2017-04-21
- Folders can now be mapped (Thanks to [mathieuvanloon](https://github.com/rquadling/bower-installer/pull/143)).

## 1.3.5 - 2017-01-25
- Will no longer crash if no configuration exists (Thanks to [Francisco Lourenço](https://github.com/rquadling/bower-installer/issues/163)).

## 1.3.4 - 2016-12-13
- Better reporting of issues with `bower.json` and/or `component.json` (Thanks to [Wang Dàpéng](https://github.com/rquadling/bower-installer/pull/161) and [Krishna Chaitanya](https://github.com/rquadling/bower-installer/pull/155))

## 1.3.3 - 2016-12-12
- Fix multiple levels of subdirectory when mapping (Thanks to [Jonathan Tougas](https://github.com/rquadling/bower-installer/issues/160))

## 1.3.2 - 2016-12-06
- Fix broken link in Spec for mapping (Thanks to [Benson Trent](https://github.com/rquadling/bower-installer/pull/158))  
  Update package dependencies, upgrade lowdash  
  Fix install: Remove unsafe version of minimatch

## 1.3.1 - 2016-12-05
- Forgot to bump release in [package.json](https://github.com/rquadling/bower-installer/package.json)

## 1.3.0 - 2016-12-05
- Project ownership transferred from [Bret Little](https://github.com/blittle) to [Richard Quadling](https://github.com/rquadling).

## 1.2.0 - 2015-01-10
- Allow matching by a regular expression instead of just file extension. (Thanks to [@g105b](https://github.com/rquadling/bower-installer/pull/101))

## 1.1.0 - 2014-12-11
- Updates to the configuration key API allowing {key}, {version}, and {name}. Also do not require a base path parameter. (Thanks to [@kimus](http://github.com/rquadling/bower-installer/pull/96))

## 1.0.0 - 2014-11-20
- Breaking API changes, --keep flag removed in favor of --remove-install-path or -p - [#53](https://github.com/rquadling/bower-installer/issues/53)
- Destination paths configurable - [#70](https://github.com/rquadling/bower-installer/pull/70)
- Fixes [#83](https://github.com/rquadling/bower-installer/pull/83), [#78](https://github.com/rquadling/bower-installer/pull/78), [#76](https://github.com/rquadling/bower-installer/pull/76)

## 0.8.4 - 2014-07-24
- Add silent option to avoid console.log output. --silent or -s closes [#58](https://github.com/rquadling/bower-installer/pull/58)
 
## 0.8.3 - 2014-07-24
- Path can now be blank, allowing for install into root of project. fixes [#59](https://github.com/rquadling/bower-installer/pull/59)

## 0.8.2 - 2014-07-24
- Upgrade bower to fix underlying bugs.

## 0.8.1 - 2014-07-24
- Upgrade the version of bower and jasmine, bump version

## 0.8.0 - 2014-06-18
- Add an option for not removing the destination directories (--keep or -k). Preserve folder structures per extensions issue [#52](https://github.com/rquadling/bower-installer/pull/52)

## 0.7.1 - 2014-04-01
- Remove erroneous console log

## 0.7.0 - 2014-04-01
- Preserve folder structure when using glob patterns.

## 0.6.2 - 2014-02-21

## 0.6.1 - 2013-12-31 
- The commandline flag --remove or -r will remove the "bower_components" directory when installation completes.

## 0.6.0 - 2013-12-13
- Add file globbing and a travis-ci enabled test suite.

## 0.5.0 - 2013-09-24
- Add the ignore option

## 0.4.5 - 2013-09-22

## 0.4.4 - 2013-09-20

## 0.4.3 - 2013-08-21

## 0.4.2 - 2013-08-03

## 0.4.1 - 2013-07-29

## 0.4.0 - 2013-07-25
- Remove file-utils dependency and update to support bower 1.0.0 and also run bower install

## 0.3.0 - 2013-06-03
- Fix race condition error when installing to long paths, path folders would be deleted and recreated in time for installing files.
- Also support bower.json and component.json files (bower.json taking precedence)

## 0.2.2 - 2013-04-15
- Change multi path install to be based upon file type

## 0.2.1 - 2013-04-15
- Remove debugger statement

## 0.2.0 - 2013-04-15
- Add add the ability to install to multiple paths

## 0.1.4 - 2013-04-15
- Add prefer global

## 0.1.3 - 2013-02-26
- Fixing package.json bin reference

## 0.1.2 - 2012-11-28

## 0.1.1 - 2012-11-28
- Fix bower dependency to be the latest

## 0.1.0 - 2012-11-14
- Fix path dependency issues

## 0.0.11 - 2012-11-06
- Add the ability to provide multiple sources to install

## 0.0.7 - 2012-11-05
- Update ref

## 0.0.6 - 2012-11-05
- Fix create/remove directory path ref

## 0.0.5 - 2012-11-05
- Fix references

## 0.0.4 - 2012-11-05

## 0.0.3 - 2012-11-05
- Update paths to component.json

## 0.0.2 - 2012-11-05
- Update package.json

## 0.0.1 - 2012-11-05
- Initial commit

