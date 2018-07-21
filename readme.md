Asset Manager
=============
This package provides support for loading assets into an application. An Asset is a data object
of some description that is defined by the application itself. For example, it may be an audio
file or an image file or any other type of resource an application may wish to load.

Defining Assets
===============

Asset Providers
===============
As asset provider is an object that can create instances of a particular asset type.

Complex Assets
==============
Some assets may be too complicated to define in a simple asset description entry, for example
an image file contains large binary data. For these asset types, we place the URI for the binary
data inside the asset description and load them as an additional step within our provider.