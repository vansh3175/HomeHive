const Listing = require('../models/listing.js');
async function getGeoJSON(address) {
    console.log(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.length === 0) {
        console.error("No results found");
        return null;
    }

    const { lat, lon } = data[0];

    return {
        
        geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
        }
    };
}

module.exports.index = async (req,res)=>{
    if(req.query){
        const allListings = await Listing.find(req.query);
        res.render("listings/index.ejs",{allListings});
    }
    else{
        const allListings = await Listing.find();
        res.render("listings/index.ejs",{allListings});
    }
}

module.exports.search = async (req,res)=>{
    const allListings = await Listing.find();
    console.log(req.params.q);
    const listingRequired = allListings.filter(lis => 
        lis.title.toLowerCase().includes(req.params.q.toLowerCase()) 
    );
    console.log(listingRequired);
    res.render("listings/index.ejs",{allListings:listingRequired});
}



module.exports.showListing = async (req,res)=>{
    let {id}= req.params;
    let lis = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!lis){
        req.flash("error","Listing not found");
        res.redirect("/listings")
    }
    else res.render("listings/show.ejs",{lis});
    
}
module.exports.createListing = async (req,res)=>{
    
    let url = req.files[0].path;
    let filename = req.files[0].filename;
    let lis = new  Listing(req.body.listing);
    lis.image.url=url;
    lis.image.filename=filename;
    let resp=await getGeoJSON(lis.location);
    console.log(resp);
    lis.geoLocation = resp.geometry;
    console.log(lis.geoLocation);
    
    lis.owner = req.user._id;
    
    await lis.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings"); 
}
module.exports.editForm = async (req,res)=>{
    let {id}= req.params;
    let lis = await Listing.findById(id);
    let ogurl = lis.image.url;
    ogurl = ogurl.replace("/upload","/upload/h_250,w_300");
    res.render("listings/edit.ejs",{lis,ogurl});

}
module.exports.edit = async(req,res,next)=>{
    
    let {id}=req.params;
    let Lis = await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});
    if(req.files[0]){
        let url = req.files[0].path;
        let filename = req.files[0].filename;
        Lis.image.url =url;
        Lis.image.filename=filename;
        await Lis.save();
    }
    req.flash("success","Listing Updated successfully");
    res.redirect(`/listings/${id}`);

}
module.exports.destroy = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect(`/listings`);

}