<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '悬赏招募'>
    <script type="text/javascript">
        var listUrl = '${urlServiceCustomReward}';
        var reviewUrl = '${urlServiceCustomRewardReview}';
    </script>
</@inc.header>

<@inc.body 'page-open page-manage-reward'>

    <div class="content content-col">
        <div class="content-in">

            <#-- 左侧导航 开始 -->
            <@sidebar.nav 'reward'></@sidebar.nav>
            <#-- 左侧导航 结束 -->

            <#-- 右侧内容 开始 -->
            <div class="main" id="J_Main">
                <div class="service-box">
                    <div class="pic-box"><img src="${imageURL}/${simpleServiceTagVo.serviceTagImg}?w=56&h=56" alt="" width="56" height="56"></div>
                    <h1 class="tit">${simpleServiceTagVo.serviceTagName}</h1>
                    <a href="${urlServiceCustomReward}" class="comm-btn btn-l btn-service fr">返回</a>
                </div>

                <div class="top-box">
                    <div class="tit fl">悬赏评审</div>
                    <a href="javascript:;" class="comm-btn comm-btn-ex2 btn-new fr" id="J_End">结束奖赏</a>
                </div>

                <div class="pn pn-assess">
                    <#-- 主题 开始 -->
                    <div class="comm-mod3 mod-subject" id="J_Reward" style="display:none;"></div>
                    <#-- 主题 结束 -->

                    <div class="comm-mod4 mod-comment" style="display:none;">
                        <div class="mod-hd">
                            <ul class="comm-list2" id="J_Tabs">
                                <li class="list-item">
                                    <a href="javascript:;" class="con current" data-status="0">未评审</a>
                                </li>
                                <li class="list-item">
                                    <a href="javascript:;" class="con" data-status="1">已评审</a>
                                </li>
                            </ul>
                        </div>
                        <div class="mod-bd">
                            <div class="comm-list3" id="J_List"></div>
                            <#-- 分页 开始 -->
                            <ul class="pagination" id="J_Page"></ul>
                            <#-- 分页 结束 -->
                        </div>
                    </div>
                </div>

            </div>
            <#-- 右侧内容 结束 -->
        </div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/service/custom/reward/review/main.js');
    </script>
</@inc.footer>