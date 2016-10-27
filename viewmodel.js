//setup current courses data
var Course = function(data) {
    this.clickCount = ko.observable(data.clickCount);
    this.title = ko.observable(data.title);
};
//list of courses with information
var courses = [{
    position: 0,
    title: 'Pine Valley Golf Club',
    yrOpen: '1918',
    designer: 'George Crump & H.S. Colt',
    rank: '2nd',
    clickCount: 0,
    location: {
        lat: 39.7872,
        lng: -74.9717
    }
}, {
    position: 1,
    title: 'Shinnecock Hills Golf Club',
    yrOpen: '1931',
    designer: 'William Flynn',
    rank: '4th',
    clickCount: 0,
    location: {
        lat: 40.8964,
        lng: -72.4406
    }
}, {
    position: 2,
    title: 'Augusta National Golf Club',
    yrOpen: '1933',
    designer: 'Alister Mackenzie & Bobby Jones',
    rank: '1st',
    clickCount: 0,
    location: {
        lat: 33.5021,
        lng: -82.0226
    }
}, {
    position: 3,
    title: 'Cypress Point Club',
    yrOpen: '1928',
    designer: 'Alister Mackenzie',
    rank: '3rd',
    clickCount: 0,
    location: {
        lat: 36.5791272,
        lng: -121.9638452
    }
}, {
    position: 4,
    title: 'National Golf Links of America',
    yrOpen: '1911',
    designer: 'C.B. Macdonald',
    rank: '8th',
    clickCount: 0,
    location: {
        lat: 40.7195264,
        lng: -74.0089934
    }
}, {
    position: 5,
    title: 'Merion Golf Club',
    yrOpen: '1912',
    designer: 'Hugh Wilson',
    rank: '5th',
    clickCount: 0,
    location: {
        lat: 40.0019,
        lng: -75.3118
    }
}, {
    position: 6,
    title: 'Oakmont Country Club',
    yrOpen: '1903',
    designer: 'Henry Fownes',
    rank: '6th',
    clickCount: 0,
    location: {
        lat: 40.5259,
        lng: -79.8269
    }
}, {
    position: 7,
    title: 'Pebble Beach Golf Links',
    yrOpen: '1919',
    designer: 'Jack Neville & Douglas Grant',
    rank: '7th',
    clickCount: 0,
    location: {
        lat: 36.5688,
        lng: -121.9506
    }
}, {
    position: 8,
    title: 'Winged Foot Golf Club',
    yrOpen: '1911',
    designer: 'A.W. Tillinghast',
    rank: '9th',
    clickCount: 0,
    location: {
        lat: 40.9577,
        lng: -73.7535
    }
}, {
    position: 9,
    title: 'Fishers Island Club',
    yrOpen: '1923',
    designer: 'Seth Raynor & Charles Banks',
    rank: '10th',
    clickCount: 0,
    location: {
        lat: 41.2799,
        lng: -71.9488
    }
}];

var viewModel = function() {
    //logging the # of total clicks on my links
    this.numberOfClicks = ko.observable(0);

    this.registerClick = function() {
        this.numberOfClicks(this.numberOfClicks() + 1);
    };

    this.resetClicks = function() {
        this.numberOfClicks(0);
    };
    //if someone clicks 3 or more links, a warning is thrown
    this.hasClickedTooManyTimes = ko.computed(function() {
        return this.numberOfClicks() >= 3;
    }, this);
    //access outer 'this' of the view model
    var self = this;
    //makes the array to use in the forEach
    this.courseList = ko.observableArray([]);

    courses.forEach(function(courseItem) {
        //we use self so that the 'this' used outside of the viewModel doesn't get confused with the 'this' inside the viewModel
        self.courseList.push(new Course(courseItem));
    });
    //when you click on a link the map will only show the selected course
    this.setCurrentCourse = function(clickedCourse) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            // console.log(courses[i]['clickCount']);
        }
        //log the amount of times each link is clicked
        clickedCourse.clickCount = clickedCourse.clickCount + 1;
        console.log(clickedCourse.title + clickedCourse.clickCount);
        //what is it that makes a marker and sets it in init map? That's what should be here to take the clicked course information and return it.
        markers[clickedCourse.position].setMap(map);
    };
};
//YOU MUST PUT () AFTER ANYTHING THAT YOU WANT TO GET CALLED IN KNOCKOUT.JS, I WAS MESSING THIS UP AND GETTING AN OBJECT RETURNED WITHOUT IT
ko.applyBindings(new viewModel());
// Create a map variable
var map;

//create a blank array for all the existing markers
var markers = [];

// Complete the following function to initialize the map
function initMap() {
    // TODO: use a constructor to create a new map JS object. You can use the coordinates
    // only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.8282,
            lng: -98.5795
        },
        zoom: 4
    });

    function animate(marker) {
        if (marker.getAnimation() == null) {
            // Start animation
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Stop animation after 2 seconds
            setTimeout(function() {
                marker.setAnimation(null);
            }, (2 * 1000));
        }
    }

    var largeInfowindow = new google.maps.InfoWindow();

    // var $wikiElem = $('#wikipedia-links');
    //the following group uses the location array to create an array of markers on initialize
    for (var i = 0; i < courses.length; i++) {
        //get them from the array of courses
        var position = courses[i].location;
        var title = courses[i].title;
        var designer = courses[i].designer;
        var yrOpen = courses[i].yrOpen;
        var rank = courses[i].rank;
        //this was the simplified version of adding a wikipedia link to each map marker,
        //I want to do this with ajax, but couldn't get it to work
        var url = "https://en.wikipedia.org/wiki/" + title;

        //create a marker per location, and put locations in markers array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            designer: designer,
            yrOpen: yrOpen,
            rank: rank,
            url: url,
            id: i
        });
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + title + '&format=json&callback=?';
        // load wikipedia data
        // use the ajax method to collect data from a wiki endpoint
        $.ajax({
            type: "GET",
            url: wikiUrl,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            success: function(data, textStatus, jqXHR) {
                articles = data[1];
                articleUrl = "https://en.wikipedia.org/wiki/" + articles;

                $('#myDropdown').append('<ul class="article">' +
                    '<a href= "' + articleUrl + '">' + articles + '</a>' +
                    '</ul>');
            },
            error: function(errorMessage) {
                $('#myDropdown').text('wikipedia Articles Could Not Be Loaded');
            }
        });


        //push the marker to our array of markers
        markers.push(marker);

        //create an onclick event to open an InfoWindow at each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            // Set animation to bounce
            animate(this);
        });

        document.getElementById('show-courses').addEventListener('click', showCourses);
        document.getElementById('hide-courses').addEventListener('click', hideCourses);
    }
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        //check to make sure the infowindow is not already opened on this marker
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + '<a href= "' + marker.url + '">' + marker.title + '</a>' + '<br>' + 'Designer: ' + marker.designer + '<br>' + 'Year Opened: ' + marker.yrOpen + '<br>' + 'Current Rank: ' + marker.rank + '</div>');
            infowindow.open(map, marker);
            //make sure the marker property is cleared if the infowindow is closed...infowindow.setMarker(null) is coming up as 'not a function' and throwing an error.
            infowindow.addListener('closeclick', function() {
                // infowindow.setMarker(null);
            });
        }
    }

    // This function will loop through the markers array and display them all.
    function showCourses() {
        var bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    //Start point of building my search box FYI
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var searches = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }
        // Clear out the old markers.
        searches.forEach(function(marker) {
            marker.setMap(null);
        });
        searches = [];
        //I want to use the searches.forEach and add it to the event listener below so I don't have 2 clear searches, but I'm unsure how to....
        function clearSearch() {
            for (var i = 0; i < searches.length; i++) {
                searches[i].setMap(null);
            }
        }
        document.getElementById('clear-search').addEventListener('click', clearSearch);
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place.
            searches.push(new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });




    //the ending point of init map function FYI
}

// This function will loop through the listings and hide them all.
function hideCourses() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function showDropDownBox() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};