import Ember from 'ember';

export default Ember.Controller.extend({
	searchText: null,
	moviesResults: null,
	searchResults: function() {
		var _this = this;

		var query = _this.get('searchText') || '';
		query = query.toLowerCase();
		var propertyKey = "name";
		var results = Ember.A();
		var moviesResults = _this.get('moviesResults');

		if (!Ember.isEmpty(moviesResults)) {
			Ember.$.each(moviesResults,
				function(index, item) {
					if (item.get(propertyKey) && item.get(propertyKey).toLowerCase().indexOf(query) !== -1) {
						results.pushObject(item);
					}
				});
		}
		return results;
	}.property('searchText', 'moviesResults'),
	searchTextChange: function() {
		var _this = this;

		var searchText = _this.get('searchText');
		var moviesResults = _this.get('moviesResults');
		var searchResults = _this.get('searchResults');
		if (!Ember.isEmpty(searchText) && searchText.length > 2 && (Ember.isEmpty(moviesResults) || Ember.isEmpty(searchResults))) {
			Ember.$.post(
				'search', {
					"query": searchText
				},
				function(data, err) {
					_this.set('moviesResults', Ember.A());
					Ember.$.each(data, function(index, value) {
						var obj = _this.store.createRecord('movie', value);

						_this.get('moviesResults').pushObject(obj);
					});
				}, "json");

		} else if (Ember.isEmpty(searchText) || searchText.length <= 2) {
			_this.set('moviesResults', null);

		}
	}.observes('searchText')
});