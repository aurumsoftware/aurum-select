##Important: Please keep in mind that this is an ongoing project. :)

#aurum-select - AngularJS Select element

This package was forked from https://github.com/semeano/ng-dropdown-multiselect and the only differences from the original are:

* Removed dropdown and multiselect for use only the simple component of select with or without search filter.
* See too [aurum-dropdown](#) dropdown element and [aurum-multiselect](#) multiselect element.

###Install
  bower install ac-dropdown-multiselect --save

#Full API Documentation
##Attributes

List of allowed attributes, you can find more information about them in the usage examples above.

| Attribute Name      | Type         | Description    |
| ------------------- | ------------ | -------------- |
| **selected-model**  | Object/Array | The object the will contain the model for the selected items in the dropdown. |
| **options**         | Object/Array | The options for the dropdown. |
| **events**          | Object       | vents callbacks, more information below. |
| **search**          | String       | Enable search filter on dropdown with placeholder name of field search. |
| **placeholder**     | String       | Placeholder text of the button. |

##Settings

You dont need settings, only set `search` attribute to enable search filter and `placeholder` attribute to set button placeholder.

##Events

Available event callbacks what the directive fires. These callbacks are set with `events` attribute.

| Event name  | Paramaters  | Description   |
| ----------- | ----------- | ------------- |
| **onItemSelect** | item | Fired when selecting an item. |
| **onInitDone** |  | Fired when the directive done with the "link" phase. |