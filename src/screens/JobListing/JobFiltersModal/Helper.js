class Helper {
  static getFilterDetails = (item, selectedFilters) => {
    const matchedFilter = selectedFilters?.find(
      filter => filter?.name === item?.id,
    );

    return {
      isApplied: Boolean(matchedFilter),
      label: matchedFilter ? matchedFilter?.title : item?.title,
    };
  };

  static getAppliedFiltersPillFirst = (filterTabs, selectedFilters) => {
    let appliedFilters = [];
    let otherFilters = [];

    // Assuming getFilterDetails is defined elsewhere and accessible here
    filterTabs?.forEach(filter => {
      const {isApplied} = this.getFilterDetails(filter, selectedFilters);

      if (isApplied) {
        appliedFilters.push(filter);
      } else {
        otherFilters.push(filter);
      }
    });

    // Concatenate the arrays so that applied filters come first
    return [...appliedFilters, ...otherFilters];
  };
}

export default Helper;
