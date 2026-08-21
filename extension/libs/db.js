export function contactDB(query, site, pwd="placeholder", sites="sites", pwds="passwords", table="passwords", user="if0_39584228", host="sql200.infinityfree.com", name="if0_39584228_HexLock", pass="VvTh3IBbNY7ENI") {
    fetch("https://corsproxy.io/?key=9a40ef96&url=http://hexlock.rf.gd/", {
    method: "POST",
    body: new URLSearchParams({
        db_host: host,
        db_name: name,
        db_user: user,
        db_pass: pass,
        table: table,
        site: site,
        pwd: pwd,
        sites: sites,
        pwds: pwds,
        query: query
    })
})
.then(async r => {
    console.log("Status:", r.status);
    console.log("Headers:");
    for (const [key, value] of r.headers) {
        console.log(key, value);
    }
    console.log("Body:", await r.text());
})
.catch(console.error);
}