var yu = {};
const express = require("express");
const bodyparser = require("body-parser");
const _ = require("lodash");
const mongoose = require('mongoose');
const { identity } = require("lodash");
mongoose.connect('mongodb://localhost:27017/tododb', { useNewUrlParser: true });
const app = express();
app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
const todoschema = {
    namee: String,
};
const Todo = mongoose.model('Todo', todoschema);
const todo1 = new Todo({ namee: "Welcome to TODO" });
const listschema = {
    titlee: String,
    items: [todoschema],
    chek: Boolean,
    colour: String,
    bodiecolor: String
};
const List = mongoose.model("List", listschema);
app.post("/", function (req, res) {
    const namme = req.body.listname;
    const dataa = req.body.userinput;
    List.findOne({ titlee: namme }, function (err, foundList) {
        const todo = new Todo({ namee: dataa });
        foundList.items.push(todo);
        foundList.save();
    });
    res.redirect("/neww/" + namme);
});
app.post("/delete", function (req, res) {
    const checkedid = req.body.checkbox;
    const listName = req.body.listname;
    //console.log(listName)
    List.findOneAndUpdate({ titlee: listName }, { $pull: { items: { _id: checkedid } } }, function (err, founded) {
        if (!err) {
            res.redirect("/neww/" + listName);
        }
    });
});
app.post("/neww", function (req, res) {
    const daa = _.capitalize(req.body.newwinput);
    if (daa == "") {
        res.redirect("/");
    }
    List.findOne({ titlee: daa }, function (err, foundList) {
        List.findOne({ chek: true }, function (err, founditems) {
            if (!err && (daa.length > 0)) {
                if (!foundList) {
                    const tod1 = new List({
                        titlee: daa,
                        chek: false,
                        colour: founditems.colour,
                        bodiecolor: founditems.bodiecolor
                    });
                    tod1.save();
                    res.redirect("/neww/" + daa);
                } else {
                    res.redirect("/neww/" + foundList.titlee);
                }
            }
        });
    });
});
app.post("/setcolour", function (req, res) {
    const col1 = req.body.change;
    const col2 = req.body.change1;
    var arr=[];
    List.find({}, function (err, founditem) {
        for (var i = 0; i < founditem.length; i++) {
            arr.push(founditem[i].titlee);
        }
        if (col1 != "nothing") {
            for (var i = 0; i < founditem.length; i++) {
                List.findOneAndUpdate({titlee : arr[i]},{bodiecolor:col1},function(err,fnd){
                });
            }
        }
        if (col2 != "ntg") {
            for (var i = 0; i < founditem.length; i++) {
                List.findOneAndUpdate({titlee : arr[i]},{colour:col2},function(err,fnd){});
            }
        }
    });
    res.redirect("/theme");
});
app.get("/", function (req, res) {
    List.findOne({ chek: true }, function (err, founditems) {
        //console.log("found ",founditems);
        if (!err) {
            if (!founditems) {
                const list1 = new List({
                    titlee: "Home",
                    items: todo1,
                    chek: true,
                    colour: "black",
                    bodiecolor: "CD853F"
                });
                list1.save();
                yu = list1;
                //console.log(yu);
            }
            else {
                yu = founditems;
                //console.log(yu);
            }
        }
        List.find({}, function (err, founditem) {
            //console.log("this is", founditem);
            res.render("index", { currentdayy: yu.titlee, currentday: yu, todoo: founditem, collor: yu.colour, bodycolor: yu.bodiecolor });
        });
    });
});
app.get("/theme", function (req, res) {
    List.find({}, function (err, founditem) {
        //console.log(founditem);
        yu = founditem[0];
        res.render("theme", { collor: yu.colour, bodycolor: yu.bodiecolor, todoo: founditem});
    });
});
app.get("/neww", function (req, res) {
    List.find({}, function (err, founditems) {
        res.render("neww", { todoo: founditems, collor: founditems[0].colour, bodycolor: founditems[0].bodiecolor });
    });
});
app.get("/delete/:del", function (req, res) {
    const del = req.params.del;
    List.findOne({ titlee: del }, function (err, fd) {
        //console.log(fd);
        if (fd.chek === true) {
            List.find({}, function (err, gf) {
                //console.log("entered to new treu",gf);
                for (var g = 0; g < gf.length; g++) {
                    if (gf[g].chek === false) {
                        var delone = gf[g].titlee;
                        List.findOneAndUpdate({ titlee: delone }, { chek: true }, function (err, founditems) { });
                        break;
                    }
                }
            });
        }
    });
    List.deleteOne({ titlee: del }, function (err, found) {
        if (!err) {
            if (found) {
                //console.log(found);
            }
        }
    });
    res.redirect("/");
});
app.get("/neww/:deff", function (req, res) {
    const deff = req.params.deff;
    //console.log("here ",deff);
    List.findOne({ titlee: deff }, function (err, founditems) {
        //console.log(founditems);
        List.find({}, function (err, founditem) {
            //console.log(founditem);
            res.render("index", { currentdayy: founditems.titlee, currentday: founditems, todoo: founditem, collor: founditem[0].colour, bodycolor: founditem[0].bodiecolor });
        });
    });
});
app.get("/default/:custom", function (req, res) {
    const custom = req.params.custom;
    custom.toLowerCase;
    List.findOneAndUpdate({ chek: true }, { chek: false }, function (err, founditems) {
    });
    List.findOneAndUpdate({ titlee: custom }, { chek: true }, function (err, foundd) {
    });
    res.redirect("/neww/" + custom);
});
app.listen(3000);