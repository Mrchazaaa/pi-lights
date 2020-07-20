import React from 'react';

export default function Logs() {
    var logs = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse maximus eleifend ex eget tristique. Aenean sit amet facilisis elit, sit amet sagittis augue. Sed sodales magna quis turpis elementum tincidunt. Nunc ac ante tortor. Ut in ante nec nunc sollicitudin varius vitae vitae mauris. Aliquam ut gravida dui. Ut cursus felis nec finibus lobortis. Ut eu odio elementum, auctor quam eu, blandit risus.

    Ut quis ex semper est blandit efficitur at at eros. Nunc sed ante augue. Nulla at elementum mauris, eu euismod ipsum. Quisque ut finibus turpis. Donec porttitor id tortor et sollicitudin. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed tincidunt rutrum arcu a accumsan. Vestibulum aliquet magna quis varius ultricies. Etiam sit amet consequat nulla, ac bibendum mauris.

    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc vehicula tortor ante, vel elementum sem dapibus non. Donec semper libero a tempor dapibus. Nullam at urna tempor augue feugiat congue in at magna. Aenean imperdiet facilisis eros quis pretium. Morbi varius ultrices turpis at ornare. Praesent convallis sem vel massa tincidunt, eu accumsan turpis pretium. Morbi placerat blandit eros, quis fermentum arcu convallis ac. Nunc maximus orci at dui consequat vestibulum. In maximus eu orci non elementum. In hac habitasse platea dictumst. Nullam ut leo at leo ullamcorper tincidunt ac ac enim. Integer aliquet justo massa, ac rutrum diam venenatis a.

    Suspendisse eget tortor et quam maximus tincidunt malesuada vitae leo. Suspendisse nisi nibh, varius non lacinia et, volutpat eget est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent hendrerit auctor ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fringilla auctor magna pretium euismod. Aliquam tortor lacus, blandit eget posuere vitae, rutrum et nulla. Aenean lobortis feugiat velit, non consequat dui placerat non. Phasellus cursus quam ligula, vitae eleifend velit laoreet vel.

    Integer nibh urna, maximus eu metus vel, ullamcorper varius diam. Mauris id ultrices dui. Aliquam ullamcorper pretium vulputate. Praesent at est ac nisi sagittis imperdiet vitae et elit. Sed vel finibus lorem. Maecenas at nulla sapien. Phasellus hendrerit ante sed enim vulputate, non pharetra turpis tristique. Nam consectetur quam vel tempus sodales. Duis posuere eget dolor eget aliquet. Donec metus est, placerat in nisl nec, blandit laoreet ligula. In eu est eu odio feugiat maximus. Fusce tincidunt, ligula ac volutpat pretium, nisi enim aliquam ex, vitae feugiat leo nisi vitae diam`;

    logs = logs.split('\n').map((item, i) => { return <p key={i}>{item}</p>})

    return (
        <div className="card border-secondary mb-3"
            style={{margin: '15px'}}>
            <div className="card-header">Logs</div>
            <div 
                className="card-body" 
                style={{
                    overflowY: 'scroll',
                    height: '300px',
                }}>
                <p className="card-text">
                {
                    logs
                }
                </p>
            </div>
        </div>
    );
}