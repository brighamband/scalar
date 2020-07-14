! function(e, t, a) {
    var i, o, n = function() {
        this.formData = {}, t.get(chrome.runtime.getURL("podio-form.html"), function(e) {
            t("body").append(e)
        }), t.get(chrome.runtime.getURL("podio-window.html"), function(e) {
            t("body").append(e)
        }), t.get(chrome.runtime.getURL("loader.html"), function(e) {
            t("body").append(e)
        }), this.injectGenerator(), this.startChecks(), this.bindEvents()
    };
    n.prototype.injectGenerator = function() {
        var e;
        t("div#ext-button-generate").length > 0 || (e = setInterval(function(a) {
            var i = t("li#create");
            if (1 === i.length) {
                t('#break-field,[id*="break-field"]').prev().addClass("ext-podio-rounded");
                i.find("ul").after('<div class="color-DCEBD8" id="ext-button-generate" tabindex="0">Generate Engagement Letter</div>'), i.find("ul").remove(), clearInterval(e)
            }
        }, 500))
    }, n.prototype.loading = function(e) {
        t(".ext-podio-loader").toggle(e)
    }, n.prototype.bindEvents = function() {
        t(document).on("click", "#ext-button-generate", () => {
            this.getAppByLabel().then(() => {
                this.getItem(this.getItemId(), e => {
                    this.itemInfo = e, e.app_item_id && this.generateForm(this.extractFields(e.fields))
                })
            })
        }).on("click", "#ext-podio-form-hide", function() {
            t(".ext-podio-form").fadeOut("fast", function() {
                t(this).hide()
            })
        }).on("click", "#ext-podio-btn-preview", function() {
            t(".ext-podio-file-name a").get(0).click()
        }).on("click", "#ext-podio-btn-download", () => {
            this.downloadDoc()
        }).on("click", "#ext-podio-btn-save", () => {
            this.uploadDoc()
        }).on("change", 'input[name="securityType"]', function() {
            "Convertible note" === t(this).val() ? t("#noteValued").show() : t("#noteValued").hide()
        }).on("submit", ".ext-podio-form-inner form", e => {
            e.preventDefault(), this.generateDoc()
        }).on("click", "#toast-login", () => {
            this.authenticate()
        }).on("click", "#cal-details", () => {
            this.initCalEvents()
        }).on("click", ".task-del", () => {
            this.delTask(this)
        }).on("click", '#pricing li:contains("Open pricing sheet")', e => {
            this.openPricingSheet(e)
        }).on("click", ".ext-podio-window", function(e) {
            t(".ext-podio-window").hide(), location.reload()
        })
    }, n.prototype.getItem = function(e, a, i) {
        a && (this.activeItemId = e, this.activeCallback = a);
        var o = {
            action: "get_item"
        };
        this.activeApp && (o.appId = this.activeApp), e instanceof Object ? o = t.extend({}, o, e) : o.itemId = e, i || this.loading(!0), chrome.runtime.sendMessage(o, e => {
            this.loading(!1), !1 !== e && a(e)
        })
    }, n.prototype.autoItem = function() {
        this.getItem(this.activeItemId, this.activeCallback)
    }, n.prototype.initCalendar = function() {
        setInterval(() => {
            0 === t(".fc-agendaWeek-view.fc-agenda-view").length && this.autoCalendar()
        }, 500)
    }, n.prototype.autoCalendar = function() {
        var e;
        e = setInterval(function() {
            var i = t(".items-fullcalendar-header.fullcalendar-header > div.right");
            if (t("#cal-details").length > 0) clearInterval(e);
            else if (i.length > 0) {
                var o = i.find('a.change-view:contains("Month")'),
                    n = a.type("a", {
                        href: "#",
                        class: "button-new change-view color-DCEBD8",
                        text: "Details",
                        "data-value": "",
                        id: "cal-details"
                    });
                o.before(n), clearInterval(e)
            }
        }, 500)
    }, n.prototype.initCalEvents = function() {
        var e, a = t(".fc-agendaWeek-view.fc-agenda-view");
        e = setInterval(() => {
            var t = a.find(".fc-day-grid-event:visible").not(".ext-podio-event-processed");
            t.length > 0 && (this.getEventDetails(t), clearInterval(e))
        }, 500)
    }, n.prototype.getEventDetails = function(e) {
        var a = this,
            i = {
                "SLC Due": {
                    alias: "slc-due",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                },
                Progress: {
                    alias: "progress",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                },
                Preparer: {
                    alias: "preparer",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                },
                Reviewer: {
                    alias: "reviewer",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                }
            };
        if (e && e.length > 0) {
            var o = [];
            this.activeApp || o.push(function(e) {
                a.getAppByLabel().then(e)
            }), e.each(function() {
                var n = this;
                o.push(function(o) {
                    var s = a.getItemId(t(n).attr("href"));
                    a.getItem({
                        appId: a.activeApp,
                        itemId: s
                    }, function(t) {
                        t instanceof Object ? (a.formData = {}, a.extractValues(i, a.extractFields(t.fields)), a.addEventDetails(n, a.formData), setTimeout(o, 300)) : 0 == t && (a.activeItemId = !1, a.activeCallback = !1, a.calendarEvents = e)
                    }, !0)
                })
            }), async.waterfall(o, () => {
                console.log("done"), this.autoCalendar()
            })
        }
    }, n.prototype.addEventDetails = function(e, i) {
        if (!t(e).hasClass("ext-podio-event-processed")) {
            i["slc-due"] = i["slc-due"] || null, i.progress = i.progress || null, i.preparer = i.preparer || null, i.reviewer = i.reviewer || null;
            var o, n, s, r = a.type("div", {
                class: "ext-podio-preparer-row"
            });
            for (var l in i)
                if ("preparer" === l || "reviewer" === l) {
                    var p = [];
                    for (var c in i[l]) {
                        var d = a.type("img", {
                            src: i[l][c].thumb,
                            title: i[l][c].name
                        });
                        p.push(d)
                    }
                    a.append(r, p)
                } else if ("slc-due" === l || "progress" === l) {
                o || (o = a.type("div", {
                    class: "ext-podio-slc-progress-row"
                }), s = a.type("div"), n = a.type("div"));
                var u = a.type("span", {
                    html: "slc-due" === l ? "<b>" + moment(i["slc-due"]).format("MMM D") + "</b>" : '<img src="' + chrome.runtime.getURL("images/checkbox.png") + '" class="ext-podio-checkbox" />&nbsp;' + (i.progress || 0) + "%"
                });
                "slc-due" === l ? a.append(n, u) : "progress" === l && a.append(s, u)
            }
            a.append(o, [s, n]), t(e).addClass("ext-podio-event-processed").append(o).append(r)
        }
    }, n.prototype.authenticate = function() {
        chrome.runtime.sendMessage({
            action: "oauth"
        }, e => {
            if (!0 === e) this.activeItemId && this.activeCallback ? this.getItem(this.activeItemId, this.activeCallback) : this.calendarEvents && this.getEventDetails(this.calendarEvents);
            else {
                if ("string" != typeof e) throw "Unknown error: " + (e || "");
                chrome.runtime.sendMessage({
                    action: "create_tab",
                    url: e
                })
            }
        })
    }, n.prototype.uploadDoc = function() {
        this.loading(!0), t.ajax({
            type: "POST",
            url: "https://4bdc2e22.ngrok.io/podio-php/tempFileUpload.php",
            data: {
                docID: this.fileProp.properties.fileId,
                itemID: this.itemInfo.item_id,
                fileName: this.fileProp.fileTitle
            },
            dataType: "json",
            success: e => {
                this.loading(!1), toastr.success(this.fileProp.fileTitle + " has been uploaded!", "Success"), t('li#send li:contains("Send Engagement Letter")').attr("data-persist", !0)
            },
            error: function(e) {
                this.loading(!1), toastr.success(this.fileProp.fileTitle + " has been uploaded!", "Success"), t('li#send li:contains("Send Engagement Letter")').attr("data-persist", !0)
            }
        })
    }, n.prototype.downloadDoc = function() {
        var e = "https://drive.google.com/uc?export=download&id=" + this.fileProp.properties.fileId;
        a.type("a", {
            href: e,
            target: "_blank"
        }).get(0).click()
    }, n.prototype.makeDate = function(e) {
        var t = e.split("-");
        return [t[1], t[2], t[0]].join("/")
    }, n.prototype.extractValues = function(e, t) {
        var i = {};
        for (var o in t)
            for (var n = t[o], s = 0; s < n.length; s++) {
                var r = n[s],
                    l = e[r.label];
                if (e[r.label]) {
                    var p = [];
                    if (r.values.length > 0) {
                        var c = r.values[0];
                        "Company" === r.label || "Signer" === r.label ? (p = c.value.title, "Company" === r.label && (this.formData.companyId = c.value.app_item_id, this.formData.appId = c.value.app.app_id)) : "Valuation Date" === r.label ? p = this.makeDate(c.start_date) : "Deal fee" === r.label || "Lower fee" === r.label ? p = c.value : "Deal type" === r.label || "CA Entity?" === r.label ? p = c.value.text : "Street Address" === r.label ? p = c.value : "City" === r.label ? p = c.value : "State" === r.label ? p = c.value : "Zip Code" === r.label ? p = c.value : "EL options" === r.label ? p = "NDA attached" === c.value.text : "Deal specification" === r.label ? p = c.value.substring(c.value.indexOf("<br />~") + 7, c.value.lastIndexOf("~")) : "SLC Due" === r.label ? p = this.makeDate(c.start_date) : "Progress" === r.label ? p = c.value : "Preparer" === r.label || "Reviewer" === r.label ? (p = [], r.values.forEach(function(e) {
                            p.push({
                                name: e.value.name,
                                thumb: e.value.image.thumbnail_link
                            })
                        })) : console.log("Value not found for " + r.label), this.formData[l.alias] = p, l.attrs.value = p, l.attrs.name = l.alias, "hidden" === l.attrs.type ? i[l.alias] = a.type("input", l.attrs) : i[l.alias] = this.createRow(r.label, l.attrs)
                    } else this.formData[l.alias] = !1, console.log("No values for: " + r.label)
                }
            }
        if (i.valuationPrice && i.lowerFee) {
            var d = a.type("input", {
                    type: "number",
                    name: "upperFee",
                    value: this.formData.valuationPrice,
                    class: "ext-podio-input ext-podio-input-range"
                }),
                u = a.type("input", {
                    type: "number",
                    name: "lowerFee",
                    value: this.formData.lowerFee,
                    class: "ext-podio-input ext-podio-input-range"
                });
            i.valuationPrice = this.createRow("Range of values", !1, [u, d]), delete i.lowerFee
        }
        var m = [];
        for (var f in i) m.push(i[f]);
        return m
    }, n.prototype.generateForm = function(e) {
        this.formData = {};
        var i = {
                Company: {
                    alias: "company",
                    dom: "input",
                    isTag: !0,
                    attrs: {
                        type: "text",
                        class: "ext-podio-input ext-podio-tags"
                    }
                },
                "Valuation Date": {
                    alias: "valuationDate",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input ext-podio-input-date"
                    }
                },
                "Deal fee": {
                    alias: "valuationPrice",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                },
                "Lower fee": {
                    alias: "lowerFee",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                },
                Signer: {
                    alias: "name",
                    dom: "input",
                    isTag: !0,
                    attrs: {
                        type: "text",
                        class: "ext-podio-input ext-podio-tags"
                    }
                },
                "Deal type": {
                    alias: "dealType",
                    dom: "input",
                    attrs: {
                        type: "text",
                        class: "ext-podio-input"
                    }
                },
                "EL options": {
                    alias: "nda",
                    dom: "input",
                    required: !0,
                    attrs: {
                        type: "hidden",
                        class: "ext-podio-input"
                    }
                },
                "Deal specification": {
                    alias: "lineItems",
                    dom: "input",
                    required: !1,
                    attrs: {
                        type: "hidden",
                        class: "ext-podio-input"
                    }
                },
                "CA Entity?": {
                    alias: "caEntity",
                    dom: "input",
                    required: !1,
                    attrs: {
                        type: "hidden",
                        class: "ext-podio-input"
                    }
                }
            },
            o = this.extractValues(i, e);
        for (var n in i) !0 !== i[n].required || this.formData[i[n].alias] || (this.formData[i[n].alias] = !1);
        if (console.log(this.formData), "Purchase Price Allocation (ASC 805)" === this.formData.dealType) {
            var s = a.type("input", {
                    type: "text",
                    name: "acquirer",
                    class: "ext-podio-input",
                    value: this.formData.company
                }),
                r = a.type("input", {
                    type: "text",
                    name: "target",
                    class: "ext-podio-input"
                });
            o.splice(3, 0, this.createRow("Acquirer", !1, [s])), o.splice(4, 0, this.createRow("Target", !1, [r]))
        } else if ("Enterprise Valuation" === this.formData.dealType) {
            var l = a.type("input", {
                type: "text",
                name: "valReason",
                class: "ext-podio-input"
            });
            o.splice(3, 0, this.createRow("Valuation reason", !1, [l]))
        } else if ("Gift & Estate" === this.formData.dealType) {
            var p = a.type("input", {
                    type: "text",
                    name: "percentOwned",
                    class: "ext-podio-input"
                }),
                c = a.type("input", {
                    type: "text",
                    name: "transferEntity",
                    class: "ext-podio-input"
                });
            o.splice(3, 0, this.createRow("Percent owned", !1, [p])), o.splice(4, 0, this.createRow("Transfer Entity", !1, [c]))
        } else if ("Valuation Consulting" === this.formData.dealType) {
            var d = a.type("input", {
                type: "text",
                name: "purpose",
                class: "ext-podio-input"
            });
            o.splice(3, 0, this.createRow("Purpose", !1, [d]))
        } else if ("Derivative Valuation (ASC 815)" === this.formData.dealType) {
            var u = [];
            ["Warrant", "Convertible note"].forEach(function(e) {
                var t = a.type("label", {
                        text: e
                    }),
                    i = {
                        type: "radio",
                        name: "securityType",
                        class: "ext-podio-input ext-podio-input-radio",
                        value: e
                    };
                a.prepend(t, a.type("input", i)), u.push(t)
            }), o.splice(3, 0, this.createRow("Security Type", !1, u)), u = [], ["Entire note", "Conversion feature only"].forEach(function(e) {
                var t = a.type("label", {
                        text: e
                    }),
                    i = {
                        type: "radio",
                        name: "noteValued",
                        class: "ext-podio-input ext-podio-input-radio",
                        value: e
                    };
                a.prepend(t, a.type("input", i)), u.push(t)
            }), o.splice(4, 0, this.createRow("Note Valued", !1, u, {
                style: "display: none",
                id: "noteValued"
            })), u = [], ["Valuing underlying asset", "Not valuing underlying asset"].forEach(function(e) {
                var t = a.type("label", {
                        text: e
                    }),
                    i = {
                        type: "radio",
                        name: "valuing",
                        class: "ext-podio-input ext-podio-input-radio",
                        value: e
                    };
                a.prepend(t, a.type("input", i)), u.push(t)
            }), o.splice(5, 0, this.createRow("Valuing", !1, u))
        } else if ("Profits Interest" === this.formData.dealType) {
            u = [];
            ["Fair", "Threshold"].forEach(function(e) {
                var t = a.type("label", {
                        text: e
                    }),
                    i = {
                        type: "radio",
                        name: "valueType",
                        class: "ext-podio-input ext-podio-input-radio",
                        value: e
                    };
                a.prepend(t, a.type("input", i)), u.push(t)
            }), o.splice(3, 0, this.createRow("Security Type", !1, u))
        } /* start of Brigham ASC 350 addition */ else if ("Goodwill Impairment (ASC 350)" === this.formData.dealType) {
          var p = a.type("input", {
                  text: "text",
                  name: "reportingUnit",
                  class: "ext-podio-input"
              });
          o.splice(3,0, this.createRow("Reporting Unit(s)", !1, [p]))
            u = [];
            ["Single", "Multiple"].forEach(function(e) {
                var t = a.type("label", {
                        text: e
                    }),
                    i = {
                        type: "radio",
                        name: "valueType",
                        class: "ext-podio-input ext-podio-input-radio",
                        value: e
                    };
                a.prepend(t, a.type("input", i)), u.push(t)
           }), o.splice(3, 0, this.createRow("Security Type", !1, u))
        }
        // end of Brigham ASC 350 addition
        this.formData.position = this.getSignorPost(), o.push(this.createRow("Position", {
            type: "text",
            class: "ext-podio-input",
            value: this.formData.position,
            name: "position"
        })), this.getCompanyInfo(e => {
            var i = t(".ext-podio-form");
            i.find("form").html("");
            var n = a.type("div", {
                    class: "ext-podio-form-header"
                }),
                s = a.type("h2", {
                    text: "Engagement Letter Generator"
                });
            a.append(n, s), i.find("form").append([n].concat(o).concat(e)), i.show(), this.formDocGenerate(), this.loading(!1), this.applugins()
        })
    }, n.prototype.createRow = function(e, i, o, n) {
        i.required = !0;
        var s = a.type("div", {
                class: "ext-podio-col-left"
            }),
            r = a.type("div", {
                class: "ext-podio-col-right"
            }),
            l = a.type("div", t.extend({}, {
                class: "ext-podio-row"
            }, n || {})),
            p = a.type("label", {
                text: e
            });
        return Array.isArray(i) ? i.forEach(function(e) {
            a.append(r, a.type("text" == e.type || "email" == e.type ? "input" : e.type, e))
        }) : i instanceof Object && a.append(r, a.type(i.domType || "input", i)), o && a.append(r, o), a.append(s, p), a.append(l, [s, r]), l
    }, n.prototype.getSignorPost = function() {
        return t("#signor > div.frame-wrapper > div.frame-content > div > div.badges > div > article > section > section:nth-child(3) > div:nth-child(1) > div > div > div > div > p > span").text()
    }, n.prototype.getCompanyInfo = function(e) {
        var t = {
            "Street Address": {
                alias: "streetAddress",
                dom: "input",
                attrs: {
                    type: "text",
                    class: "ext-podio-input"
                }
            },
            City: {
                alias: "city",
                dom: "input",
                attrs: {
                    type: "text",
                    class: "ext-podio-input"
                }
            },
            State: {
                alias: "state",
                dom: "input",
                attrs: {
                    type: "text",
                    class: "ext-podio-input"
                }
            },
            "Zip Code": {
                alias: "zip",
                dom: "input",
                isTag: !0,
                attrs: {
                    type: "text",
                    class: "ext-podio-input"
                }
            }
        };
        this.getItem({
            itemId: this.formData.companyId,
            appId: this.formData.appId
        }, a => {
            var i = this.extractValues(t, this.extractFields(a.fields));
            e(i)
        })
    }, n.prototype.extractFields = function(e) {
        for (var t = {}, a = 0; a < e.length; a++) {
            var i = e[a].type;
            t[i] || (t[i] = []), t[i].push(e[a])
        }
        return t
    }, n.prototype.formDocGenerate = function() {
        var e;
        e = a.type("button", {
            type: "submit",
            class: "ext-podio-btn ext-podio-btn-default",
            id: "ext-podio-btn-generate",
            text: "Generate"
        }), this.formActions([e])
    }, n.prototype.formDocActions = function() {
        var e, t;
        t = a.type("button", {
            type: "button",
            class: "ext-podio-btn ext-podio-btn-default",
            id: "ext-podio-btn-preview",
            text: "Preview"
        }), e = a.type("button", {
            type: "button",
            class: "ext-podio-btn ext-podio-btn-default",
            id: "ext-podio-btn-download",
            text: "Download"
        }), this.formActions([t, e])
    }, n.prototype.formActions = function(e) {
        var i = a.type("div", {
                class: "ext-podio-col-left"
            }),
            o = a.type("div", {
                class: "ext-podio-col-right"
            }),
            n = a.type("div", {
                class: "ext-podio-file"
            }),
            s = a.type("div", {
                class: "ext-podio-file-icon"
            }),
            r = a.type("div", {
                class: "ext-podio-file-name"
            }),
            l = a.type("div", {
                id: "ext-podio-row-doc-actions",
                class: "ext-podio-row"
            }),
            p = a.type("label");
        btnCancel = a.type("button", {
            type: "button",
            id: "ext-podio-form-hide",
            class: "ext-podio-btn ext-podio-btn-default",
            style: "float: right",
            text: "Close"
        }), a.append(i, p), a.append(n, [s, r]), a.append(o, n), a.append(o, e.concat([btnCancel])), a.append(l, [i, o]), t("#ext-podio-row-doc-actions").remove(), t(".ext-podio-form").find("form").append(l)
    }, n.prototype.generateDoc = function() {
        for (var e = t(".ext-podio-form-inner form").serializeArray(), a = {}, i = 0; i < e.length; i++) a[e[i].name] = e[i].value;
        "Convertible note" !== a.securityType && delete a.noteValued, a.logo = "https://www.scalaranalytics.com/wp-content/themes/scalar/img/scalar-logo.jpg", a.companyEL = a.company.replace(",", "-c-"), a.halfPricing = a.valuationPrice ? parseFloat(a.valuationPrice) / 2 : parseFloat(a.upperFee) / 2, a.firstName = a.name.split(" ")[0];
        var o, n = {
            "IRC 409A": {
                url: "https://www.ultradox.com/run/KGGcnyiceAD3lMmIjYsPBo7oohKgFP"
            },
            "Purchase Price Allocation (ASC 805)": {
                url: "https://www.ultradox.com/run/Geb1xgPmfpidpEqHFvMnqEdyNj6I4U"
            },
            "Goodwill Impairment (ASC 350)": {
                url: "https://www.ultradox.com/run/kretTGPemsESXgjHvgieLGe5OyJO27"
            },
            "Stock-based Compensation (ASC 718 - IFRS2)": {
                url: "https://www.ultradox.com/run/AZjAVOGGATRY5mXwkdsss5co4lj0QZ"
            },
            "Derivative Valuation (ASC 815)": {
                url: "https://www.ultradox.com/run/kiNYM67SyHYxAgXBjy26v6rTQ6Q8Y1"
            },
            "Portfolio Valuation (ASC 820)": {
                url: "https://www.ultradox.com/run/4BBa00gr9oDjbYfSU5JFVDTR0VQrRE"    // Brigham edit (updated url)
            },
            "Enterprise Valuation": {
                url: "https://www.ultradox.com/run/C3ixhAp3x1dzhP7y2nl1lz6Q5w4nuS"
            },
            "Gift & Estate": {
                url: "https://www.ultradox.com/run/CLb48jsNxcAMnvxLXKFBKqpN5z433V"
            },
            "Valuation Consulting": {
                url: "https://www.ultradox.com/run/DWH38E91Vy46wWJq80elVUf6Nc5wBT"
            },
            "Marital Dissolution": {
                url: "https://www.ultradox.com/run/yqQRxMVkvlaIkd2yaHdCDPA27ahZbP"    // Brigham edit (updated url)
            },
            "Shareholder Buyout & Disputes": {
                url: "https://www.ultradox.com/run/a18NMMtfmbEWP21aK0fxhLAYUMot4A"    // Brigham edit (updated url)
            },
            "Commercial Damages Analysis": {
                url: "https://www.ultradox.com/run/Rz87Pa9EtoGeuENZo6U63RlsqpLBc7"
            },
            "Intellectual Property Disputes": {
                url: "https://www.ultradox.com/run/4i3io6UeMOKPaGS5mtZU6nBikTGBZd"    // Brigham edit (updated url)
            },
            "Bankruptcy & Restructuring Valuation": {
                url: "https://www.ultradox.com/run/Rz87Pa9EtoGeuENZo6U63RlsqpLBc7"
            },
            "1099-R & 5498": {
                url: "https://www.ultradox.com/run/DWH38E91Vy46wWJq80elVUf6Nc5wBT"
            },
            "Entity Conversion": {
                url: "https://www.ultradox.com/run/LPWlZzGbkFW7mnEgvWAkvWwqIOesP2"
            },
            "Solvency Opinion": {
                url: "https://www.ultradox.com/run/VW3nA1HGQv0HNZtVdsnWcf6xJNTWqJ"
            },
            "Fairness Opinion": {
                url: "https://www.ultradox.com/run/iruUpIiGO2LlSxpvuKp98lmZiIM1Qw"
            },
            "Intangible Asset Impairment (ASC 360)": {
                url: "https://www.ultradox.com/run/Rd1qjy0Rc5ll1FXnzfQOHytrj5F5UB"
            },
            "ESOP": {
                url: "https://www.ultradox.com/run/0NGYLpSL4UuCGTIEKN8ex6IiU4tea8"
            },
            "Common Stock": {
                url: "https://www.ultradox.com/run/lR7c2GFeOEdTUVLAtWJaHbiKNOQQSs"
            },
            "Profits Interest": {
                url: "https://www.ultradox.com/run/zGg24A2bFmrQucY5WRzaQbZ36LPLgf"
            },
            "Equity Valuation": {
                url: "https://www.ultradox.com/run/iq1higahyzr7BunKrqNfFjSxz7tZ69"
            },
      			// start of Brigham main Podio generation additions
      			"Solvency Opinion": {
      				url: "https://www.ultradox.com/run/v4WIzOrJHa4nWQigaEYQIQRPOoWAIh"
      			},
      			"Tax Valuation": {
      				url: "https://www.ultradox.com/run/3SoOzx2uDtaj78z21mniT7jfGiBIU0"
      			},
      			"NDA only": {
      				url: "https://www.ultradox.com/run/lkTR1UZLMG6BBforQyRH3jSO3eZrwg"
      			},
      			"Commercialization Model": {
      				url: "https://www.ultradox.com/run/mhuwBdbKHc2WeFIJy3z9wbD0mPmy8I"
      			},
      			"Contingent consideration": {
      				url: "https://www.ultradox.com/run/0c0yH6P030CsXQAOwwA6qsHHAq8jmh"
      			},
      			"Debt Valuation": {
      				url: "https://www.ultradox.com/run/UNpF5lH7aPnCqOS6SbS42bqzxUYkls"
      			},
      			"SBA 7(a)": {
      				url: "https://www.ultradox.com/run/mfKqVkwVA5goeTwiRGibkQWYbhf49D"
      			},
      			"Convertible note": {
      				url: "https://www.ultradox.com/run/1bCrIoUPEfU4shFY26vLpISt35ZIUa"
      			},
      			"Convertible Note with Conversion Feature": {
      				url: "https://www.ultradox.com/run/e7thPKtY5YXzpuM8XyAYsHQe2Z09SE"
      			},
      			"Warrant": {
      				url: "https://www.ultradox.com/run/bn6iwYSNofGmhnH2rHQK6c7RZIfbcn"
      			},
      			"Letter of Opinion (Memo Only)": {
      				url: "https://www.ultradox.com/run/cNqNvoUABmNimkN8rzmFBxP8uiCCH4"
      			},
      			"Valuation Consulting (Multiple Analysis)": {
      				url: "https://www.ultradox.com/run/o2Eh3PYari9X1RxUVScgKjcAGfyOgS"
      			},
      			"Underlying Securities": {
      				url: "https://www.ultradox.com/run/AIllzDQlYx0UUFAB03zEplHUU987QI"
      			},
      			"Goodwill Impairment (ASC 350)": {
      				url: "https://www.ultradox.com/run/lT6cvZOZQHj2lTO0tni802qN5u0aYb"
      			}
			      // end of Brigham main Podio generation additions
        } [a.dealType].url + "?&" + t.param(a);
        this.loading(!0), t.get(n, e => {
            for (var t in e.steps) {
                e.steps[t].properties.fileId && (o = e.steps[t])
            }
            this.fileProp = o, toastr.success(o.message.replace("The generated document called ", "").replace("uploaded to Google Drive", "generated and ready for download."), "Status"), this.formDocActions(), this.formFile(o), this.loading(!1)
        }).fail(e => {
            this.loading(!1), toastr.error("Unable to generate doc. Please refer to console output for more information.", "Stop")
        })
    }, n.prototype.formFile = function(e) {
        var i = e.message.indexOf("Engagement"),
            o = e.message.substr(i).replace(" has been uploaded to Google Drive", ""),
            n = a.type("img", {
                src: chrome.runtime.getURL("images/word.png")
            }),
            s = a.type("a", {
                href: e.properties.generatedDocumentLink,
                target: "_blank",
                text: o
            });
        e.fileTitle = o, t(".ext-podio-file-icon").append(n), t(".ext-podio-file-name").append(s), t(".ext-podio-file").css("display", "flex")
    }, n.prototype.getItemId = function(t) {
        return (t = t || e.location.href).substr(t.indexOf("/items/")).split("/")[2]
    }, n.prototype.getItemApp = function(e) {
        var a, i = t(".app-header__app-menu .util-button-new .modify:visible");
        t("body").addClass("podio-ext-ninja"), i.trigger("click"), a = setInterval(() => {
            var i = t('.new.app-box-supermenu-v2 div.label:contains("Developer")');
            if (i.length > 0) {
                var o = i.closest("a").attr("href");
                setTimeout(function() {
                    t(".app-box-supermenu-v2").css("display", "none"), t("body").click().removeClass("podio-ext-ninja")
                }, 2e3);
                var n = o.substr(o.indexOf("/apps/"));
                this.activeItemApp = n.split("/")[2], clearInterval(a), "function" == typeof e && e()
            }
        }, 500)
    }, n.prototype.currency = function(e) {
        return {
            USD: "$",
            EUR: "€",
            CRC: "₡",
            GBP: "£",
            ILS: "₪",
            INR: "₹",
            JPY: "¥",
            KRW: "₩",
            NGN: "₦",
            PHP: "₱",
            PLN: "zł",
            PYG: "₲",
            THB: "฿",
            UAH: "₴",
            VND: "₫"
        } [e] || ""
    }, n.prototype.numberFormat = function(e, t, a, i) {
        e = (e + "").replace(/[^0-9+\-Ee.]/g, "");
        var o = isFinite(+e) ? +e : 0,
            n = isFinite(+t) ? Math.abs(t) : 0,
            s = void 0 === i ? "," : i,
            r = void 0 === a ? "." : a,
            l = "";
        return (l = (n ? function(e, t) {
            var a = Math.pow(10, t);
            return "" + Math.round(e * a) / a
        }(o, n) : "" + Math.round(o)).split("."))[0].length > 3 && (l[0] = l[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, s)), (l[1] || "").length < n && (l[1] = l[1] || "", l[1] += new Array(n - l[1].length + 1).join("0")), l.join(r)
    }, n.prototype.applugins = function() {
        t(".ext-podio-input-date").mask("00/00/0000", {
            selectOnFocus: !0
        })
    }, n.prototype.startChecks = function() {
        var a, i;
        a = setInterval(function() {
            var e = t(".files-list .file-field-list-component > ul"),
                i = t('li#send li:contains("Send Engagement Letter")');
            if (i.attr("data-persist")) return i.show(), void clearInterval(a);
            e.length > 0 && (e.find("li").length > 0 ? i.is(":visible") || i.show() : i.is(":visible") && i.hide())
        }, 1e3), setInterval(function() {
            var e = t("#consultant .contact-list"),
                a = t('li#status li:contains("CLOSED")');
            e.length > 0 ? a.is(":visible") || a.show() : a.is(":visible") && a.hide()
        }, 1e3), i = setInterval(function() {
            var a = t('[aria-label="Help and Support"]');
            a.length > 0 && (a.off("click"), t(document).on("click", '[aria-label="Help and Support"]', function(t) {
                t.preventDefault(), e.open("https://docs.google.com/spreadsheets/d/1D_y5Nn41Ie4Xse-t-Vo898k0I-iHesZKvNRu8cZJ2WY/edit#gid=0&fvid=2005953040")
            }), a.attr("title", "Client Research"), clearInterval(i))
        }, 500), setInterval(function() {
            t(".layout-podio-narrow").removeClass("layout-podio-narrow"), t(".podio-help").css("display", "inline-block")
        }, 500)
    }, n.prototype.tasksActions = function() {
        var e;
        e = setInterval(function() {
            var i = t(".tasks-list .task-list > li");
            i.length > 0 && (clearInterval(e), t.each(i, function(e, i) {
                var o = a.type("span", {
                        class: "fa fa-trash-o"
                    }),
                    n = a.type("div", {
                        class: "task-del"
                    });
                a.append(n, o), t(i).find(".inner").append(n)
            }))
        }, 500)
    }, n.prototype.delTask = function(e) {
        var a = t(e).parent("div").find(".bd").find("a").attr("href").split("/tasks/")[1];
        this.loading(!0), chrome.runtime.sendMessage({
            action: "del_task",
            taskId: a
        }, () => {
            t(e).parent("div").fadeOut("fast"), this.loading(!1)
        })
    }, n.prototype.getAppByLabel = function(t) {
        var a = Q.defer(),
            i = e.location.pathname.split("/");
        return chrome.runtime.sendMessage({
            org_label: i[1],
            space_label: i[2],
            app_label: i[4],
            action: "get_app_by_space"
        }, e => {
            e.app_id && (this.activeApp = e.app_id, a.resolve(e))
        }), a.promise
    }, n.prototype.getContacts = function() {
        var e = Q.defer();
        return chrome.runtime.sendMessage({
            action: "get_contacts"
        }, function(t) {
            t && e.resolve(t)
        }), e.promise
    }, n.prototype.getSpaceMembers = function(e, t) {
        var a = Q.defer();
        return chrome.runtime.sendMessage({
            action: "get_space_members",
            space_id: e,
            data: t
        }, function(e) {
            e && a.resolve(e)
        }), a.promise
    }, n.prototype.getOrgs = function() {
        var e = Q.defer();
        return chrome.runtime.sendMessage({
            action: "get_orgs"
        }, function(t) {
            t && e.resolve(t)
        }), e.promise
    }, n.prototype.getOrgMembers = function(e) {
        var t = Q.defer();
        return chrome.runtime.sendMessage({
            action: "get_org_members",
            org_id: e
        }, function(e) {
            e && t.resolve(e)
        }), t.promise
    }, n.prototype.loadFontAwesome = function() {
        var e = document.createElement("style");
        e.type = "text/css", e.textContent = '@font-face { font-family: FontAwesome; src: url("' + chrome.runtime.getURL("plugins/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0") + '"); }', document.head.appendChild(e)
    }, n.prototype.openPricingSheet = function(e) {
        e.preventDefault();
        var a = {
                Generic: "https://script.google.com/macros/s/AKfycbyuSSy6gaOXjPuCBGb9M2_YxNmbgdKYqwdcY0PUSVQP50ggrRfq/exec",
                "Steve Lindsley": "https://script.google.com/macros/s/AKfycbxZU0Jz2a69Yus8nEzBN7fM1490AlH5-5NqlE4_x9ps2OA_jfC8/exec",
                "David Hales": "https://script.google.com/macros/s/AKfycbwHNLcKL-DgfSHB9BFAuxBJZbnmiNgT63_cIZFSd9Z72Hrbz2U/exec",
                "Zak Nugent": "https://script.google.com/macros/s/AKfycbwHNLcKL-DgfSHB9BFAuxBJZbnmiNgT63_cIZFSd9Z72Hrbz2U/exec",
                "Mike Wigton": "https://script.google.com/macros/s/AKfycbzFZct9mUVwLqNj9eogx215eH5xk3tWvlBm4WYoBAqWEEgZh2k/exec",
                "Michael Mozer": "https://script.google.com/macros/s/AKfycbxDyFEDPkOGNg1-NeL-HwHeydPk-6aH_eh4VNINvH5qqbYngB14/exec",
                "Cory Jacobs": "https://script.google.com/macros/s/AKfycbwrWwXMVlZ9k5L3eUHqR1jIFFIxL7JffmBEEWUCAC0vrRxC7c8/exec",
                "Jason Walsh": "https://script.google.com/macros/s/AKfycbwVic7rg7jr_8YctzGW7Q3kTfuHdqV8lhfBnOrfQtv6ST7owWcf/exec"
            },
            i = {
                Generic: "1nAhM6NjHw2QgA8zzFvwbKP4dzr_PALilTxM7DQbpggo",
                "Steve Lindsley": "17GWRMDEoIL7lvy3RSlindr4TPN5zH_694UJCg6C-6Ys",
                "David Hales": "1xSywRphroAdqBoktICP68yFCt2z1QHb4-z6CmjR3Hw4",
                "Zak Nugent": "1xSywRphroAdqBoktICP68yFCt2z1QHb4-z6CmjR3Hw4",
                "Mike Wigton": "1fOjJTtlXlKFfeFOJDiDO5OeuTIAL2-UA5oHqM1HWqLA",
                "Michael Mozer": "18Q_uU6SNn-YZiJmTiK436-HFFJ3VIEQRv9XVa_9PjsI",
                "Cory Jacobs": "1482svs1oEqi862u0DY24nj65f3ySoTdmpnMX8cz-Mqk",
                "Jason Walsh": "1GjI-pTIX4l0kQH7RMxp_NOgFFE42Q02m8qM8xnj1Odg"
            };
        this.getAppByLabel().then(() => {
            this.getItem(this.getItemId(), e => {
                if (e.fields && e.fields.length > 0) {
                    console.log(e);
                    var o = {};

                    function n() {
                        var e = t(".ext-podio-window"),
                            a = i[o["Sales Rep"]] || i.Generic;
                        furl = "https://docs.google.com/spreadsheets/d/" + a + "/edit?widget=true&amp;headers=none", e.find("iframe").attr("src", furl), e.show()
                    }
                    if (o.itemID = e.item_id, e.fields.map(function(e) {
                            if (e.values instanceof Array) {
                                var t = [];
                                e.values.map(function(e) {
                                    e.start_date ? t.push(e.start_date) : e.value instanceof String || "string" == typeof e.value ? t.push(e.value) : e.value instanceof Array ? e.value.map(function(e) {
                                        e instanceof String && t.push(e)
                                    }) : e.value instanceof Object && (e.value.name ? t.push(e.value.name) : e.value.text ? t.push(e.value.text) : e.value.title && t.push(e.value.title))
                                }), o[e.label] = t.join(", ")
                            }
                        }), console.log(o), Object.keys(o).length > 0) {
                        var s = a[o["Sales Rep"]] || a.Generic;
                        s && t.ajax({
                            url: s,
                            type: "POST",
                            dataType: "json",
                            data: o,
                            success: function(e) {
                                n()
                            },
                            error: function(e) {
                                n(), console.log(e)
                            }
                        })
                    }
                }
            })
        })
    }, n.prototype.onboarding = function(i) {
        var o, n, s;

        function r(e, t) {
            var a = document.createElement("textarea");
            a.value = e, a.setAttribute("readonly", ""), a.style = {
                position: "absolute",
                left: "-9999px"
            }, document.body.appendChild(a), a.select(), document.execCommand("copy"), document.body.removeChild(a), toastr.success(t + " copied to clipboard")
        }
        s = setInterval(function() {
            0 != t("#deal-type-2").length && (n = t("#deal-type-2 select :selected").val() || !1, console.log(n), 1 != n && t("#onboarding").remove(), clearInterval(s))
        }, 500), o = chrome.runtime.getURL("/").indexOf("ogphnmmfmjfaglcjhomkpfkoigdgienh") > -1 ? "http://localhost:8000/" : "http://onboarding.scalar.io/";
        var l = t(".ext-podio-form");
        t(document).on("click", '#onboarding li:contains("Generate onboarding")', i => {
            this.loading(!0), chrome.runtime.sendMessage({
                action: "get_user"
            }, i => {
                var s = [];
                t("#" + n + "doc-request ul > li").each(function(e) {
                    "-" !== t(this).text().trim() && s.push({
                        index: e,
                        type: t(this).text().trim(),
                        selected: t(this).hasClass("selected")
                    })
                }), chrome.runtime.sendMessage({
                    action: "get_request",
                    url: o + "magic/generate",
                    data: {
                        docs: s,
                        email: i.mail,
                        v: this.getItemId()
                    }
                }, t => {
                    if (console.log(t), this.loading(!1), t.magiclink) {
                        e.magiclink = t.magiclink, l.find("form").html("");
                        var i = a.type("div", {
                                class: "ext-podio-form-header"
                            }),
                            o = a.type("h2", {
                                text: "Onboarding"
                            }),
                            n = a.type("label", {
                                text: "Secure link"
                            }),
                            s = a.type("a", {
                                id: "btn-magiclink",
                                href: "javascript:void(0)",
                                text: "Access Scalar Onboarding"
                            }),
                            r = (a.type("button", {
                                type: "button",
                                id: "btn-copy-magiclink",
                                class: "button-new silver",
                                text: "Copy Link"
                            }), a.type("button", {
                                type: "button",
                                id: "btn-close-magiclink",
                                class: "button-new silver",
                                style: "margin-left: 5px;",
                                text: "Close"
                            }));
                        a.append(i, o);
                        var p = [],
                            c = a.type("div", {
                                class: "ext-podio-col-left"
                            }),
                            d = a.type("div", {
                                class: "ext-podio-col-right magiclink-col"
                            }),
                            u = a.type("div", {
                                class: "ext-podio-row"
                            });
                        c.append(n), u.append(c), d.append(a.type("span", {
                            text: "(click button to copy the link)",
                            style: "font-size: 16px; position: relative;top: 5px;"
                        })), d.append(a.type("hr")), d.append(s), d.append(a.type("hr")), d.append(r), u.append(d), p.push(u), l.find("form").append([i].concat(p)), l.show()
                    } else t.error ? toastr.error(t.error) : t.message && toastr.error(t.message)
                })
            })
        }).on("click", '#onboarding li:contains("Close onboarding")', e => {
            this.loading(!0), chrome.runtime.sendMessage({
                action: "get_user"
            }, e => {
                chrome.runtime.sendMessage({
                    action: "get_request",
                    url: o + "onboarding/close/" + this.getItemId(),
                    data: {
                        email: e.mail
                    }
                }, e => {
                    this.loading(!1), e.success ? toastr.success("Onboarding page has been closed!") : e.message && toastr.error(e.message)
                })
            })
        }).on("click", "#btn-close-magiclink", function() {
            l.hide()
        }).on("click", "#btn-copy-magiclink", function() {
            r(e.magiclink, "Link")
        }).on("click", "#btn-magiclink", function(t) {
            t.preventDefault(), r(e.magiclink, "Link")
        })
    };
    var s, r, l = ["pricing", "pricing-notes", "el", "el-process", "lost-deal"];
    n.prototype.toggleOppoFields = function(e) {
        i = setInterval(function() {
            console.log("toggleOppoFields"), t("#pricing").length > 0 && (l.forEach(function(a) {
                t("#" + a)[e]()
            }), clearInterval(i))
        }, 500)
    }, n.prototype.updateOppoFields = function() {
        o = setInterval(function() {
            if (console.log("updateOppoFields"), t("#pricing").length > 0 && (console.log(t("#lost-deal:hidden").length), l.forEach(function(e) {
                    t("#" + e + ":hidden").length > 0 && t("#" + e + ":hidden").show()
                })), t("#stage").length > 0) {
                var e = t("#stage").find('ul > li:contains("LOST")');
                e.hasClass("selected") || e.hide()
            }
            if (t("#lost-deal").length > 0) {
                var a = t("#lost-deal .blank-placeholder");
                a[0].innerHTML.toLowerCase().trim().indexOf("search") > -1 && (a[0].innerHTML = "Click here to report a Lost Deal")
            }
        }, 500)
    }, n.prototype.toggleLostDealsFields = function(e) {
        var a = ["sales-rep", "company", "deal-type", "our-pricing", "contact"];
        s = setInterval(function() {
            console.log("toggleLostDealsFields"), t("#" + a[0]).length > 0 && (a.forEach(function(a) {
                t("#" + a).toggle(e)
            }), clearInterval(s))
        }, 500)
    }, String.prototype.specCls = function() {
        var e;
        if (this.split(" ").forEach(function(t) {
                t.indexOf("color-") > -1 && (e = t.trim())
            }), e) return e.replace("color-", "#")
    }, n.prototype.funcButton = function() {
        var e = ['#deal-stage li:contains("Client Docs received")', '#deal-stage li:contains("Client Approval received")', '#deal-stage li:contains("COMPLETE DEAL")', '#status li:contains("CLOSED")', "#ext-button-generate", '#pricing li:contains("Open pricing sheet")', '#el li:contains("Send to EL Processing")', '#onboarding li:contains("Generate onboarding")', '#onboarding li:contains("Close onboarding")', '#send li:contains("Send Engagement Letter")', "#ext-button-generate"];
        r && clearInterval(r), r = setInterval(function() {
            e.forEach(function(e) {
                if (t(e).length > 0 && !t(e).first().hasClass("func-button")) {
                    var a = t(e).first();
                    if (a.addClass("func-button"), a.hasClass("selected") || "#ext-button-generate" == e) {
                        var i = a.attr("class").specCls();
                        i && a.css({
                            "box-shadow": (o = i, n = -30, s = parseInt(o.substring(1, 3), 16), r = parseInt(o.substring(3, 5), 16), l = parseInt(o.substring(5, 7), 16), s = parseInt(s * (100 + n) / 100), r = (r = parseInt(r * (100 + n) / 100)) < 255 ? r : 255, l = (l = parseInt(l * (100 + n) / 100)) < 255 ? l : 255, "#" + (1 == (s = s < 255 ? s : 255).toString(16).length ? "0" + s.toString(16) : s.toString(16)) + (1 == r.toString(16).length ? "0" + r.toString(16) : r.toString(16)) + (1 == l.toString(16).length ? "0" + l.toString(16) : l.toString(16)) + "0px 4px 0px"),
                            "border-color": i
                        })
                    }
                }
                var o, n, s, r, l
            })
        }, 100)
    }, n.prototype.investments = function() {
        var e;
        e = setInterval(function() {
            if (t("#investments").length > 0) {
                var i = t("#investments .badges > div:visible");
                if (i.length > 0) {
                    var o = [],
                        n = [];
                    try {
                        t.each(i, function(e, a) {
                            var i = t(a).find(".relationship-badge-component__title"),
                                s = {};
                            s.href = t(i).attr("href"), s.title = t(a).find(".small-text-field-value-component > p > span")[0].innerHTML, s.text = s.title;
                            var r = t(a).find(".category-field-value-component__inline-category").text();
                            "client" == r.toLowerCase() ? o.push(s) : n.push(s), s.class = "inv-" + r.toLowerCase(), t(a).hide()
                        });
                        var s = a.type("section", {
                            class: "sect-left w-50"
                        });
                        o.forEach(function(e) {
                            a.append(s, a.type("a", e))
                        }), t("#investments .badges").append(s);
                        var r = a.type("section", {
                            class: "sect-right w-50"
                        });
                        n.forEach(function(e) {
                            a.append(r, a.type("a", e))
                        }), t("#investments .badges").append(r), clearInterval(e)
                    } catch (e) {}
                }
            }
        }, 500)
    }, n.prototype.filterItems = function(e, t, a) {
        var i = Q.defer();
        return chrome.runtime.sendMessage({
            action: "filter",
            appId: a || this.activeApp,
            data: e,
            options: t || !1
        }, function(e) {
            i.resolve(e)
        }), i.promise
    }, n.prototype.makeUID = function(e) {
        for (var t = "", a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = a.length, o = 0; o < e; o++) t += a.charAt(Math.floor(Math.random() * i));
        return t
    }, n.prototype.valuationsInline = function() {
        var e, i, o, n, s, r, l, p, c, d, u = {};
        this.getAppByLabel();
        const m = function() {
            var e = t("tr > th[data-field-id]");
            const a = "ext-podio-col-editable";
            e.length > 0 && e.each(function(e, i) {
                s && s[t(i).attr("data-field-id")] && !t(i).hasClass(a) && t(i).addClass(a)
            })
        };
        m(), chrome.runtime.sendMessage({
            action: "get_request",
            url: "scripts/data/valuation-fields.json"
        }, e => {
            s = e, setInterval(m, 1e3)
        }), chrome.runtime.sendMessage({
            action: "get_request",
            url: "scripts/data/valuation-fields-options.json"
        }, e => {
            r = e
        }), chrome.runtime.sendMessage({
            action: "get_request",
            url: "scripts/data/valuation-admin.json"
        }, e => {
            let a = t(".profile-name a").text(); - 1 === e.indexOf(a) && t("body").addClass("ext-podio-moderate")
        }), String.prototype.moneyFormat = function() {
            return parseInt(this).toLocaleString("us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }, String.prototype.dtFormat = function(e) {
            return t.datepicker.formatDate(e || "mm/dd/yy", new Date(this))
        }, t.fn.dismiss = function() {
            this.html("").hide()
        }, t.fn.autoFocus = function() {
            setTimeout(() => {
                this.focus().select()
            }, 50)
        };
        const f = function(e, i, o, s, r, l, p) {
                var d = {
                    value: i
                };
                return "date" == l.type && (e = e.dtFormat("yy-mm-dd"), d = {
                    start_date: i = i.dtFormat("yy-mm-dd")
                }), e != i && chrome.runtime.sendMessage({
                    action: "update_item",
                    item_id: o,
                    field_id: s,
                    data: d
                }, function(e) {
                    if (e && e.revision) {
                        if ("text" == l.type) r.text(t(i).wrap("div").text());
                        else if ("money" == l.type) r.text("USD " + i.moneyFormat());
                        else if ("date" == l.type) r.text(i.dtFormat());
                        else if ("app" == l.type || "contact" == l.type) r.text(n);
                        else if ("category" == l.type) {
                            var o = r.find("span.field-type-state-item");
                            if (0 === o.length) o = a.type("span", {
                                class: "field-type-state-item state-option current"
                            }).appendTo(r.html(""));
                            else {
                                let e = o.attr("class").split(" ").filter(function(e) {
                                    return -1 == e.indexOf("color-")
                                });
                                o.attr("class", e.join(" "))
                            }
                            o.addClass("color-" + (p || "")).text(n)
                        }
                        var s = l.values;
                        if (s && 0 != s.length) "date" == l.type ? (s[0].start_date_utc = i, c = i.dtFormat()) : "app" == l.type ? (s[0].value.title = n, s[0].value.item_id = Number(i)) : "contact" == l.type ? (s[0].value.name = n, s[0].value.user_id = Number(i)) : "category" == l.type ? (s[0].value.text = n, s[0].value.id = Number(i)) : s[0].value = i;
                        else {
                            var d = {};
                            "date" == l.type ? d.start_date_utc = i : "app" == l.type ? d.value = {
                                item_id: i,
                                title: n
                            } : "contact" == l.type ? d.value = {
                                user_id: i,
                                name: n
                            } : "category" == l.type ? d.value = {
                                id: i,
                                text: n
                            } : d.value = i, l.values.push(d)
                        }
                    }
                }), !0
            },
            h = "#wrapper > section > section.app-wrapper__content > main > div > div.scrollable > table > tbody > tr";
        t(document).off("keydown").off("click"), t(document).on("keydown", function() {
            t("body").trigger("classChange")
        }).on("click", function(a) {
            var n = t(a.target);
            0 != n.closest(".ui-datepicker:visible").length || 0 != n.closest(".ui-selectmenu-button:visible").length || 0 != n.closest(".ui-selectmenu-menu:visible").length || n.hasClass("ui-selectmenu-button") || n.hasClass("field-type-state-item") || n.hasClass("ui-selectmenu-text") || n.hasClass("ui-menu-item-wrapper") || n.hasClass("ext-podio-input-date") || n.hasClass("ext-podio-input-obj") || n.hasClass("td") || (t(".ui-datepicker:visible").length > 0 || t(".inline-editor .ext-podio-input-date:visible").length > 0 ? (console.log("date picker stopped"), f(c, t(".ext-podio-input-date").val(), e.item_id, i, p, o) && d.dismiss()) : (t(".ext-podio-input-obj-picker:visible").length > 0 || t(".inline-editor .ext-podio-input-obj:visible").length > 0) && (console.log("app picker stopped"), d.dismiss()))
        }), t(document).on("click", "table > tbody > tr > div.td", m => {
            if (o = null, e = null, i = null, (p = t(m.currentTarget)).hasClass("ext-podio-input-date")) return;
            p.hasClass("field-type-state-item") && (p = p.closest("div.td"));
            const h = p.position(),
                g = p.index(),
                v = p.closest("tr").index(),
                y = t(p).outerHeight() - 3 + "px",
                x = t(p).outerWidth() - 3 + "px";
            async.waterfall([a => {
                var o = p.closest("table").find("thead > tr > th:nth-child(" + (g + 1) + ")");
                i = t(o).attr("data-field-id");
                var n = "body.fullscreen #wrapper > section > section.app-wrapper__content > main > div > table > tbody > tr:nth-child(" + (v + 1) + ")";
                const s = parseInt(t(n).attr("data-id"));
                parseInt(t(n).attr("data-index"));
                if (!s) return void toastr.error("Please contact your immediate supervisor for full access", "Access limited");
                const r = {
                    limit: 1,
                    filters: {
                        item_id: s
                    }
                };
                u[s] ? (e = u[s], a()) : (this.loading(!0), this.filterItems(r).then(t => {
                    if (this.loading(!1), !t.items || 0 == t.items.length) return toastr.error("Something went wrong. Please reload page and try again.");
                    e = t.items[0], u[s] = e, a()
                }))
            }, t => {
                for (var a = 0; a < e.fields.length; a++) {
                    var n = e.fields[a];
                    if (n.field_id == Number(i)) {
                        o = n, t();
                        break
                    }
                }
                if (!o) {
                    console.log("TODO: Init editor for empty fields");
                    let a = p.closest("table").find("thead > tr > th:nth-child(" + (g + 1) + ")");
                    a.text().trim().toLowerCase();
                    l = a.attr("data-field-id"), "category" == (o = {
                        field_id: l,
                        type: s[l],
                        values: []
                    }).type && (o.config = {
                        settings: {
                            options: r[l]
                        }
                    }), o.type ? (e.fields.push(o), t()) : d.dismiss()
                }
            }, s => {
                console.log(e), console.log(o), c = function(e) {
                    const t = e.values,
                        a = "money" == e.type ? 0 : "";
                    if (["text", "money"].indexOf(e.type) > -1) {
                        const i = t.length > 0 && t[0].value || a;
                        return "money" == e.type ? parseInt(i) : i
                    }
                    return "date" == e.type ? t.length > 0 && t[0].start_date_utc.dtFormat() || a : "app" == e.type ? t.length > 0 ? t[0].value.title : a : "app" == e.type ? t.length > 0 ? t[0].value.title : a : "contact" == e.type ? t.length > 0 ? t[0].value.name : a : "category" == e.type ? t.length > 0 ? t[0].value.text : a : void 0
                }(o), d = p.closest(".scrollable").find("div.inline-editor").dismiss();
                const r = {
                    top: h.top + p.closest(".scrollable").scrollTop() + "px",
                    left: h.left + p.closest(".scrollable").scrollLeft() + "px"
                };
                switch (d && 0 != d.length ? d.css(r) : d = a.type("div", {
                    class: "inline-editor",
                    style: "display:none"
                }).css(r).appendTo(p.closest(".scrollable")), o.type) {
                    case "text":
                        var l = a.type("textarea", {
                            class: "tinymce-text",
                            text: c
                        });
                        d.append(l).show(), tinymce.init({
                            selector: ".tinymce-text",
                            mode: "exact",
                            height: 150,
                            width: 500,
                            menubar: !1,
                            toolbar: "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                            init_instance_callback: function() {
                                tinymce.activeEditor.focus(), tinymce.activeEditor.on("keydown", e => {
                                    27 === e.keyCode && d.dismiss()
                                }), tinymce.activeEditor.on("blur", function(t) {
                                    var a = tinymce.activeEditor.getContent();
                                    f(c, a, e.item_id, i, p, o) && d.dismiss()
                                })
                            }
                        });
                        break;
                    case "money":
                        var u = a.type("input", {
                            style: "height:" + y + ";width:" + x,
                            class: "ext-podio-number ext-podio-input",
                            type: "number",
                            value: c,
                            min: 1,
                            step: 1
                        });
                        d.append(u).show(), u.autoFocus(), u.on("blur", t => {
                            f(c, u.val(), e.item_id, i, p, o), d.dismiss()
                        }).on("keydown", t => {
                            27 == t.keyCode && d.dismiss(), 13 == t.keyCode && f(c, u.val(), e.item_id, i, p, o) && d.dismiss()
                        });
                        break;
                    case "date":
                        var m = a.type("input", {
                            style: "height:" + y + ";width:" + x,
                            class: "ext-podio-input-date ext-podio-input",
                            type: "text",
                            value: c
                        });
                        d.append(m).show(), m.datepicker({
                            onSelect: e => {
                                console.log("select", e), m.trigger("change")
                            }
                        }).autoFocus(), m.on("keydown", e => {
                            27 == e.keyCode && d.dismiss()
                        }).on("change", t => {
                            f(c, m.val(), e.item_id, i, p, o)
                        });
                        break;
                    case "app":
                    case "category":
                        var g = this.makeUID(10),
                            v = a.type("input", {
                                style: "height:" + y + ";width:" + x + ";margin-bottom:1px",
                                class: "ext-podio-input-obj ext-podio-input",
                                type: "text",
                                value: c
                            }),
                            b = a.type("div"),
                            w = a.type("select", {
                                style: "height:" + y + ";width:" + x,
                                class: "ext-podio-input-obj-picker ext-podio-input"
                            });
                        o.config.settings.options.forEach(e => {
                            var t = a.type("option", {
                                value: e.id,
                                text: e.text
                            }).attr("data-color", e.color);
                            c == e.text && t.attr("selected", "selected"), w.append(t)
                        }), d.append([v, b.append(w)]).show(), v.autoFocus(), w.selectmenu({
                            width: x.replace("px", ""),
                            classes: {
                                "ui-selectmenu-menu": g
                            },
                            change: function(a, s) {
                                n = s.item.label, f(c, Number(w.val()), e.item_id, i, p, o, t(s.item.element).attr("data-color")) && d.dismiss()
                            }
                        }).selectmenu("open");
                        let s = {
                            width: parseInt(x.replace("px", "")) - 2 + "px",
                            "max-width": parseInt(x.replace("px", "")) - 2 + "px"
                        };
                        t("." + g).css(s).find(">ul").css(s)
                }
                s()
            }], () => {
                console.log(d.position()), console.log("done")
            })
        });
        const g = function() {
            if (t(h).length > 0)
                if (t("body").hasClass("fullscreen")) {
                    var e = t(h).outerHeight();
                    if (0 === t(h).find("td").length) return;
                    t(h).find("td").each(function(a, i) {
                        var o = t(i).clone().wrap("<div>").parent().html();
                        o = o.replace("<td", '<div style="height:' + e + 'px" ').replace("</td", "</div"), o = t(o).attr("class") && t(o).attr("class").trim().length > 0 ? o.replace('class="', 'class="td ') : o.replace("<div", '<div class="td" '), t(i).replaceWith(o)
                    })
                } else {
                    if (0 === t(h).find("div.td").length) return;
                    t(h).find("div.td").each(function(e, a) {
                        var i = t(a).clone().wrap("<div>").parent().html();
                        i = i.replace("<div", "<td").replace("</div", "</td"), t(a).replaceWith(i)
                    })
                }
        };
        g(), setInterval(g, 1e3)
    };
    var p = new n;
    chrome.runtime.onMessage.addListener(function(e, t, a) {
        if (e && e.action) switch (e.action) {
            case "toast":
                toastr[e.type || "info"](e.message, e.title || "Status");
                break;
            case "inject_engage":
                p.injectGenerator();
                break;
            case "func_button":
                p.funcButton();
                break;
            case "auto_item":
                p.autoItem();
                break;
            case "calendar_details":
                p.autoCalendar();
                break;
            case "task_actions":
                p.tasksActions();
                break;
            case "onboarding":
                p.onboarding();
                break;
            case "investments":
                p.investments();
                break;
            case "toggleOppoFields":
                clearInterval(i), clearInterval(o), p.toggleOppoFields("hide");
                break;
            case "updateOppoFields":
                clearInterval(i), clearInterval(o), p.updateOppoFields();
                break;
            case "toggleLostDealsFields":
                clearInterval(s), clearInterval(o), p.toggleLostDealsFields(e.toggle);
                break;
            case "font_awesome":
                p.loadFontAwesome();
                break;
            case "valuations_inline":
                p.valuationsInline()
        }
        return !0
    })
}(window, jQuery, PodioDom);
