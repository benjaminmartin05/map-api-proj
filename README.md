Map Project
===============================

Students should use this set of [project details](https://classroom.udacity.com/nanodegrees/nd001/parts/00113454014/modules/271165859175462/lessons/2711658591239847/concepts/26906985370923#) to complete the map project.

Here is a note on  [plagarism guidelines](https://classroom.udacity.com/nanodegrees/nd001/parts/00113454014/modules/271165859175462/lessons/2711658591239847/concepts/425224f8-c05e-4a68-8daf-7db8bcfc0766#).

## "Top 10 Golf Courses in the U.S." Instructions:
* Select map marker to see course information from wikipedia for the selected course.
* Select a course link from the table to attain course information as well.
* Use the search box at the top of the page to narrow course results.

## Helpful map project information:
* I used the [developers tools](https://developers.google.com/maps/) from google maps to primarily build my project making adjustments to their examples.
* [Knockout.js](http://knockoutjs.com/) and the listed examples were also used to create my links.
* Previous lessons from [Udacity](http://udacity.com/) were also used along with examples quite a bit in creating this project.
* An ajax request was used to attain information for the courses using [Wikepedia](http://wikepedia.org/).


        $(document).ready(function(){

            $.ajax({
                type: "GET",
                url: wikiUrl,
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    var str = data.parse.title;
                    str = str.replace(/\s/g,'_');
                    self.wikiLink = "https://en.wikipedia.org/wiki/" + str;
                    self.wikiInfo = data.parse.text["*"];
                    console.log(self.wikiLink);
                },
                error: function (errorMessage) {
                }
            });
        });