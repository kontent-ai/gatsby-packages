/* eslint-disable max-len */

const expectedResolvedRichTextComponent = `<h1>Landing page</h1>
<p><br>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis condimentum augue id magna semper rutrum. Phasellus faucibus molestie nisl. Aliquam erat volutpat. Fusce consectetuer risus a nunc. Duis viverra diam non justo. Etiam commodo dui eget wisi. In enim a arcu imperdiet malesuada. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Vivamus ac leo pretium faucibus. Nulla non arcu lacinia neque faucibus fringilla. Duis pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nulla est. Proin in tellus sit amet nibh dignissim sagittis. Aliquam erat volutpat. Donec iaculis gravida nulla. Integer malesuada. Proin mattis lacinia justo.</p>
<p><br></p>
<p type="application/kenticocloud" data-type="item" data-rel="component" data-codename="n26ddfb46_c2de_010e_3ad9_ec9aa8955144" class="kc-linked-item-wrapper">###landing_page_image_section###</p>
<p>In convallis. Vivamus porttitor turpis ac leo. Proin in tellus sit amet nibh dignissim sagittis. Nulla non arcu lacinia neque faucibus fringilla. Fusce wisi. Aenean id metus id velit ullamcorper pulvinar. Nullam eget nisl. Proin in tellus sit amet nibh dignissim sagittis. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. In rutrum. Vivamus ac leo pretium faucibus. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam neque. Morbi scelerisque luctus velit. Integer malesuada. Nam quis nulla. Integer imperdiet lectus quis justo. Ut tempus purus at lorem.</p>
<p>Projects:</p>
<ul>
  <li><a data-item-id="1a3aa6bd-7b4b-486f-86ab-7bfe359ad614" href="###projectlink###">Main projet</a></li>
  <li><a data-item-id="8a7f275d-0e1c-4b30-af3e-f02c91259faf" href="###projectlink###">Sub Broject 1</a></li>
  <li><a data-item-id="91703600-4d43-410e-ba48-93c6c8b0a754" href="###projectlink###">Sub project 2</a></li>
</ul>
<p>Aliquam ante. Nam quis nulla. Sed ac dolor sit amet purus malesuada congue. Curabitur vitae diam non enim vestibulum interdum. Phasellus et lorem id felis nonummy placerat. Etiam posuere lacus quis dolor.&nbsp;</p>
<p><strong>Project</strong></p>
<p type="application/kenticocloud" data-type="item" data-rel="link" data-codename="main_project" class="kc-linked-item-wrapper">###project###</p>
<p>Nunc tincidunt ante vitae massa. Sed vel lectus. Donec odio tempus molestie, porttitor ut, iaculis quis, sem. Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Etiam sapien elit, consequat eget, tristique non, venenatis quis, ante.</p>`;

const expectedResolvedRichTextImages = [{
  imageId: 'a58bf56b-962e-44dd-9fae-b562e3322119',
  description: 'Hand Coffee Grinder',
  url: 'https://assets-us-01.kc-usercontent.com:443/e5d9fb27-0227-00b1-1daf-05eb8ff5cb6e/a58bf56b-962e-44dd-9fae-b562e3322119/porlex-tall-ceramic-burr-grinder.jpg',
},
{
  imageId: '542ea709-63a8-4413-ae03-dd9c681efbf2',
  description: 'Hario Vacuum Pot',
  url: 'https://assets-us-01.kc-usercontent.com:443/e5d9fb27-0227-00b1-1daf-05eb8ff5cb6e/542ea709-63a8-4413-ae03-dd9c681efbf2/hario-vacuum-pot.jpg',
}];

module.exports = {
  expectedResolvedRichTextComponent,
  expectedResolvedRichTextImages,
};

