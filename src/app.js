const mongoose = require("mongoose");

const validator = require("validator");

// Connection Creation & Create a new Database.....
mongoose.connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then( () => console.log("Connection successfull..."))
.catch( () => console.log(err));


/*
* => Schema:
* A Mongoose schema defines the structure of the document,
* default values, validators, etc.
*/

/*
const { Schema } = mongoose;

const blogSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});
*/


const playlistSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
    //  lowercase : true
    //  uppercase : true
    trim : true,
    // minLength : 2,
    minLength : [2, "Enter minimum 2 letters"],
    maxLength : 30
  },
  ctype : {
    type : String,
    required : true,
    // lowercase : true,
    // enum : ["frontend", "backend", "database"],
    enum : ["Front End", "Back End", "Database"]
  },
  videos : {
    type : Number,
    // min : 0,
    // max : 500

    // --> Custom Validation
    validate(value){
        if(value < 0){
            throw new Error("videos count should not be negative");
        }
    }
    // <-- or -->
    // validate: {
    //     validator:function(value){
    //         return value.length < 0
    //     },
    //     message: "videos count should not be negative"
    // }

  },
  author : String,
  email : {
    type : String,
    required : true,
    unique : true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Email is invalid");
        }
    }
  },
  active : Boolean,
  date : {
      type : Date,
      default : Date.now
  }
});


/*
* A Mongoose model is a wrapper on the Mongoose schema
* Mongoose model provides an interface to the database for creating,
* querying, updating, deleting records, etc.
*/

// => Collection Creation.....
const Playlist = new mongoose.model("Playlist", playlistSchema);

// => Create Document or Insert
const createDocument = async() => {

    try{
        // const jsPlayList = new Playlist({
        //     name : "JavaScript",
        //     ctype :  "Front End",
        //     videos : 150,
        //     author : "Arshad Siddiqui",
        //     active : true,
        // })

        // const mongoPlayList = new Playlist({
        //     name : "JavaScript",
        //     ctype :  "Database",
        //     videos : 50,
        //     author : "Arshad Siddiqui",
        //     active : true,
        // })

        // const mongoosePlayList = new Playlist({
        //     name : "Mongoose",
        //     ctype :  "Database",
        //     videos : 100,
        //     author : "Arshad Siddiqui",
        //     active : true,
        // })

        // const expressPlayList = new Playlist({
        //     name : "ExpressJS",
        //     ctype :  "Back End",
        //     videos : 40,
        //     author : "Arshad Siddiqui",
        //     active : true,
        // })


        const testPlayList = new Playlist({
            name : "Laravel",
            ctype :  "Back End",
            videos : 30,
            author : "Arshad Siddiqui",
            email : "arsad@gmail.com",
            active : true,
        })


        // const result = await Playlist.insertMany([jsPlayList, mongoPlayList, mongoosePlayList, expressPlayList]);

        const result = await Playlist.insertMany([testPlayList]);

        // const result = await reactPlayList.save();
        console.log(result);

    }catch(err){
        console.log(err);
    }
}

createDocument();


// --------------------------------------------------------------------


// const getDocument = async () => {
    // const result = await Playlist.find();
    // const result = await Playlist.find({ctype:"Front End"});

    // const result = await Playlist.find({ctype:"Front End"})
    // .select({name:1});

//     try{
//         const result = await Playlist.find({ctype:"Front End"})
//         .select({name:1})
//         .limit(1);

//         console.log(result);
//     }catch(err){
//         console.log(err);
//     }
// }

// getDocument();


// --------------------------------------------------------------------
// ==> https://docs.mongodb.com/manual/reference/
// ==> https://mongoosejs.com/docs/guide.html

// => Operators
// => Query Selectors

/*
Comparison:
Name        Description
* $eq       Matches values that are equal to a specified value.
* $gt       Matches values that are greater than a specified value.
* $gte      Matches values that are greater than or equal to a specified value.
* $in       Matches any of the values specified in an array.
* $lt       Matches values that are less than a specified value.
* $lte      Matches values that are less than or equal to a specified value.
* $ne       Matches all values that are not equal to a specified value.
* $nin      Matches none of the values specified in an array.

Logical:
* $and      Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
* $not      Inverts the effect of a query expression and returns documents that do not match the query expression.
* $nor      Joins query clauses with a logical NOR returns all documents that fail to match both clauses.
* $or       Joins query clauses with a logical OR returns all documents that match the conditions of either clause.

Element:
* $exists   Matches documents that have the specified field.
* $type     Selects documents if a field is of the specified type.

Evaluation:
* $expr         Allows use of aggregation expressions within the query language.
* $jsonSchema   Validate documents against the given JSON Schema.
* $mod          Performs a modulo operation on the value of a field and selects documents with a specified result.
* $regex        Selects documents where values match a specified regular expression.
* $text         Performs text search.
* $where        Matches documents that satisfy a JavaScript expression.

Geospatial:
* $geoIntersects  Selects geometries that intersect with a GeoJSON geometry. 
                  The 2dsphere index supports $geoIntersects.
* $geoWithin      Selects geometries within a bounding GeoJSON geometry. 
                  The 2dsphere and 2d indexes support $geoWithin.
* $near           Returns geospatial objects in proximity to a point. 
                  Requires a geospatial index. The 2dsphere and 2d indexes support $near.
* $nearSphere     Returns geospatial objects in proximity to a point on a sphere. 
                  Requires a geospatial index. The 2dsphere and 2d indexes support $nearSphere.

Array:
$all            Matches arrays that contain all elements specified in the query.
$elemMatch      Selects documents if element in the array field matches all the specified $elemMatch conditions.
$size           Selects documents if the array field is a specified size.

Bitwise:
* $bitsAllClear   Matches numeric or binary values in which a set of bit positions all have a value of 0.
* $bitsAllSet     Matches numeric or binary values in which a set of bit positions all have a value of 1.
* $bitsAnyClear   Matches numeric or binary values in which any bit from a set of bit positions has a value of 0.
* $bitsAnySet     Matches numeric or binary values in which any bit from a set of bit positions has a value of 1.


Projection Operators:
* $             Projects the first element in an array that matches the query condition.
* $elemMatch    Projects the first element in an array that matches the specified $elemMatch condition.
* $meta         Projects the document's score assigned during $text operation.
* $slice        Limits the number of elements projected from an array. Supports skip and limit slices.


Miscellaneous Operators:
* $comment    Adds a comment to a query predicate.
* $rand       Generates a random float between 0 and 1.






/
^           # match beginning of string
[a-z]       # match a letter for the first char
(?:         # start non-capture group
_?          # match 0 or 1 '_'
[a-z0-9]+   # match a letter or number, 1 or more times
 )*         # end non-capture group, match whole group 0 or more times
 $          # match end of string
/i          # case insensitive flag

*/


// --------------------------------------------------------------------


const getDocument = async () => {

    try{
        const result = await Playlist

        // .find({videos: 50})
        // .find({videos: {$eq:50}})
        // .find({videos: {$ne:50}})

        // .find({videos: {$gt:50}})
        // .find({videos: {$gte:50}})
        // .find({videos: {$lt:50}})
        // .find({videos: {$lte:50}})

        // .find({ctype: {$in: ["Back End", "Database"]} })
        // .find({ctype: {$nin: ["Back End", "Database"]} })

        // .find({ $or : [ {ctype : "Back End"}, {author : "Arshad Siddiqui"} ] })

        // .find({ $and : [ {ctype : "Back End"}, {author : "Arshad Siddiqui"} ] })

        // .find({ $nor : [ {ctype : "Back End"}, {ctype : "Front End"} ] })

        // .find({ videos: { $not: {$gt: 50} } } )

        // .find({ ctype: { $not: /^F.*/ } } )
        // .find({ name: { $not: /^M.*/ } } )

        // .find( { name: { $not: { $regex: "^M.*" } } } )
        // .find( { name: { $not: { $regex: /^M.*/ } } } )

        // .find( { name: { $regex: /^M.*/i } } )
        // .find( { name: { $regex: /S/ } } )
        // .find( { name: { $regex: /[sS]/ } } )
        // .find( { name: { $regex: /S$/i } } )


        .find( { author : "Arshad Siddiqui" })
        .select({name:1})
        // .sort();
        .sort({name : 1});
        // .sort({name : -1});
        // .countDocuments()
        // .limit(1);

        console.log(result);
    }catch(err){
        console.log(err);
    }
}

// getDocument();


// -------------------------------------------------------------------


const updateDocument = async (_id) => {

    try{
        // const result = await Playlist.updateOne({_id}, {
        const result = await Playlist.findByIdAndUpdate({_id}, {
            $set : {
                name : "CSS"
            }
        },
        {
            new : true,
            useFindAndModify : false
        });

        console.log(result);

    }catch(err){
        console.log(err);
    }


}

// updateDocument("60efcbd86eda22b2a6a98f90");



// -------------------------------------------------------------------

const deleteDocument = async (_id) => {

    try{
        // const result = await Playlist.deleteOne( {_id} );
        const result = await Playlist.findByIdAndDelete( {_id} );

        console.log(result);
    }catch(err){
        console.log(err);
    }
}

// deleteDocument("60efd4de6eda22b2a6a98f93");