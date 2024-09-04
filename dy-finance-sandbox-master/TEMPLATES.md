<!-- Title -->
<h1 style="text-align: center">
  Finance Sandbox App Templates
</h1>

<!-- Header -->
<div style="text-align: center">
  <b>Those are optional templates which you can use to quick preview the demo.</b>
  <br />

<ul style="text-align: left">
    <li>App Settings</li>
    <li>Card form</li>
    <li>Custom Page</li>
    <li>Articles</li>
    <li>Categories (inner menu)</li>
    <li>Push notification</li>
    <li>HP Banner</li>
</ul>
</div>

<!-- Body -->

## App Settings Template

<div style="text-align: left">

```
{
  "textColor": "${Login text color}",
  "generalTextColor": "${General text color}",
  "headerColor": "${Header background color}",
  "btnTextColor": "${Button text color}",
  "btnBackgroundColor": "${Button background color}",
  "menuBackgroundColor": "${Menu background color}",
  "menuActiveTintColor": "${Menu active tint color}",
  "menuInActiveTintColor": "${Menu inActive tint color}",
  "menuBadgeColor": "${Menu badge color}",
  "menuBadgeTextColor": "${Menu badge text color}",
  "loginBackground": "${Background image}",
  "middleBtnBackgroundColor": "${Middle button background color}",
  "middleBtnIconColor": "${Middle button icon color}"
}
```

<p>
    For all colors you will pick variable setting 'Color Picker' and for image you will pick 'Image'
</p>
</div>

---

## Card form Template

<div style="text-align: left">

```
{
  "title": "${Form title}",
  "content": "${Form content}",
  "image": "${Card image}",
  "cta": "${Button text}"
}
```

<p>
    For title, content and button text you going to pick 'Text' as Variable setting and for image 'Image'
</p>
</div>

---

## Custom Page Template

<div style="text-align: left">

```
{
  "title": "${Form title}",
  "content": "${Form content}",
  "image": "${Card image}",
  "cta": "${Button text}"
}
```

<p>
    For title, content and button text you going to pick 'Text' as Variable setting and for image 'Image'
</p>
</div>

---

## Articles Template

<div style="text-align: left">

```
{
  "title": "${Article title}",
  "content": "${Article content}",
  "image": "${Article image}",
  "cta_btn": "${Article button text}",
  "order": "${Article order}"
}
```

<p>
    For title, content and cta_btn you going to pick 'Text' as Variable setting, for image pick 'Image' and for article order pick Number with min of 0 and max 99
</p>
</div>

---

## Categories Template

<div style="text-align: left">

```
[{
    "title": "${First item title}",
    "icon": "${First item icon}",
    "order": "${First item order}",
    "slug": "${First item slug}",
    "backgroundColor": "${First item background color}",
    "color": "${First item text color}",
    "balance": "${First item balance}"
  },
  {
    "title": "${Second item title}",
    "icon": "${Second item icon}",
    "order": "${Second item order}",
    "slug": "${Second item slug}",
    "backgroundColor": "${Second item background color}",
    "color": "${Second item text color}",
    "balance": "${Second item balance}"
  },
  {
    "title": "${Third item title}",
    "icon": "${Third item icon}",
    "order": "${Third item order}",
    "slug": "${Third item slug}",
    "backgroundColor": "${Third item background color}",
    "color": "${Third item text color}",
    "balance": "${Third item balance}"
  },
  {
    "title": "${Fourth item title}",
    "icon": "${Fourth item icon}",
    "order": "${Fourth item order}",
    "slug": "${Fourth item slug}",
    "backgroundColor": "${Fourth item background color}",
    "color": "${Fourth item text color}",
    "balance": "${Fourth item balance}"
  },
  {
    "title": "${Fifth item title}",
    "icon": "${Fifth item icon}",
    "order": "${Fifth item order}",
    "slug": "${Fifth item slug}",
    "backgroundColor": "${Fifth item background color}",
    "color": "${Fifth item text color}",
    "balance": "${Fifth item balance}"
  },
  {
    "title": "${Sixth item title}",
    "icon": "${Sixth item icon}",
    "order": "${Sixth item order}",
    "slug": "${Sixth item slug}",
    "backgroundColor": "${Sixth item background color}",
    "color": "${Sixth item text color}",
    "balance": "${Sixth item balance}"
  }
]
```

<p>
    Variables settings:
    <br/>
    title -> Text
    <br/>
    icon -> Image
    <br/>
    order -> Number -> min 0 -> max 99
    <br/>
    slug -> Text
    <br/>
    backgroundColor -> Color Picker
    <br/>
    color -> Color Picker
    <br/>
    balance -> Number -> placeholder 100
    <br/>
    All those settings will be saved under different tabs for example: First Item, Second Item and etc
</p>
</div>

---

## Push notification Template

<div style="text-align: left">

```
{
  "title": "${Notification title}",
  "body": "${Notification body}",
  "delay": "${Notification delay}",
  "enabled": "${Notification enabled}"
}
```

<p>
    For title and body you going to pick 'Text' as Variable setting, for delay pick 'Number' and for enabled pick Dropdown with values Yes -> true and No -> false
</p>
</div>

---

## HP Banner Template

<div style="text-align: left">

```
{
  "top": "${Top text}",
  "topFontColor": "${Top font color}",
  "topFontSize": "${Top font size}",
  "topBackgroundColor": "${Top background color}",
  "bottom": "${Bottom text}",
  "bottomFontColor": "${Bottom font color}",
  "bottomFontSize": "${Bottom font size}",
  "bottomBackgroundColor": "${Bottom background color}",
  "ctaText": "${CTA text}",
  "ctaBackgroundColor": "${CTA background color}",
  "image": "${Image}",
  "enableClose": "${Enable close button}"
}
```

<p>
    For top, bottom, ctaText you going to pick 'Text' as Variable setting, for topFontColor, topBackgroundColor, bottomBackgroundColor, bottomFontColor and ctaBackgroundColor pick 'Color Picker', pick 'Number' and for enableClose pick Dropdown with values Yes -> true and No -> false. For image pick 'Image' and for the rest pick 'Number' min 8 and max 34
</p>

---

## Required API selectors

<ul style="text-align: left">
    <li>expo-app-settings</li>
    <li>expo-push-notification</li>
    <li>expo-custom-page</li>
    <li>expo-hp-banner</li>
    <li>expo-articles-slider</li>
    <li>expo-offers-slider</li>
    <li>expo-categories</li>
</ul>

<p>
When you create campaigns you can use Targeting tab and under 'Who?' you can use Custom Attribute -> account_type which can be business or student.
</p>
<p>
Some of the campaigns will require custom Data Feed like expo-articles-slider or expo-offers-slider. You can disable them by removing them from the selectors in DY.choose calls
</p>
</div>
