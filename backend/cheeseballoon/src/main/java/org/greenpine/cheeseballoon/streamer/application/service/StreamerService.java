package org.greenpine.cheeseballoon.streamer.application.service;

import lombok.RequiredArgsConstructor;
import org.greenpine.cheeseballoon.live.adapter.out.persistence.FindStreamerLiveResDtoInterface;
import org.greenpine.cheeseballoon.ranking.adapter.out.persistence.StatisticsEntity;
import org.greenpine.cheeseballoon.streamer.adapter.out.persistence.*;
import org.greenpine.cheeseballoon.streamer.application.port.out.dto.*;
import org.greenpine.cheeseballoon.streamer.application.port.in.StreamerUsecase;
import org.greenpine.cheeseballoon.streamer.application.port.out.StreamerPort;
import org.greenpine.cheeseballoon.streamer.domain.StreamerLiveDomain;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
// 서비스는 유스케이스의 구현을 담당하고 Port를 사용함
public class StreamerService implements StreamerUsecase {

    private final StreamerPort streamerPort;

    @Override
    public List<FindSearchStreamerResDtoInterface> searchStreamer(String query, long memberId) {

        List<FindSearchStreamerResDtoInterface> result =  streamerPort.searchStreamersByName(query, memberId);

        return result;
    }

    @Override
    public FindStreamerSummaryResDto streamerDetailSummary(Long streamerId, String[] dtCodes, LocalDateTime[] specificDates) {

        FindSummaryRankResDtoInterface curr = streamerPort.streamerDetailSummary(streamerId, dtCodes[0], specificDates[0], specificDates[1]);
        FindSummaryRankResDtoInterface before = streamerPort.streamerDetailSummary(streamerId, dtCodes[1], specificDates[2], specificDates[3]);

        Integer follower = streamerPort.streamerFollower(streamerId, specificDates[1]);
        Integer before_follower = streamerPort.streamerFollower(streamerId, specificDates[3]);

        if(follower == null){
            follower = 0;
        }
        if(before_follower == null){
            before_follower = 0;
        }

        FindStreamerSummaryResDto ret = new FindStreamerSummaryResDto(0,0,0,0,0,0, follower,follower-before_follower,0D,0D);

        if(curr != null){
            ret.setRank(curr.getRank());
            ret.setDiff(-301+curr.getRank());
            ret.setAvgViewer(curr.getAverageViewer());
            ret.setViewerDiff(curr.getAverageViewer());
            ret.setFollow(curr.getFollower());
            ret.setFollowDiff(curr.getFollower());
            ret.setRating(curr.getRating());
            ret.setRatingDiff(curr.getRating());
            ret.setTotalAirTime(curr.getTotalAirTime());
            ret.setTotalAirTime(curr.getTotalAirTime());
        }

        if(before != null){

            Double rating_diff = Math.round( (ret.getRating() - before.getRating()) *100 ) / 100.0;

            ret.setDiff( ret.getRank() -before.getRank());
            ret.setTimeDiff(ret.getTotalAirTime() - before.getTotalAirTime());
            ret.setViewerDiff(ret.getAvgViewer() - before.getAverageViewer());
            ret.setRatingDiff(rating_diff);
            ret.setFollowDiff(ret.getFollow() - before.getFollower());
        }

        return ret;
    }

    @Override
    public FindStreamerDetailResDto streamerDetail(Long streamerId, long memberId) {

        FindStreamerDetailResDto streamerEntity = streamerPort.streamerDetail(streamerId, memberId);

        return streamerEntity;
    }

    @Override
    public FindStreamerDetailLiveResDto streamerDetailLive(Long streamerId) {

        FindStreamerLiveResDtoInterface live = streamerPort.streamerDetailLive(streamerId);

        FindStreamerDetailLiveResDto result = FindStreamerDetailLiveResDto.builder()
                .liveId(live.getLiveId())
                .liveLogId(live.getLiveLogId())
                .isLive(live.getIsLive())
                .streamUrl(live.getStreamUrl())
                .thumbnailUrl(live.getThumbnailUrl())
                .build();


        return result;
    }

    @Override
    public List<FindStreamerFollowDto> streamerDetailFollower(Long streamerId, LocalDateTime[] dates) {

        List<StreamerLogEntity> list = streamerPort.streamerDetailFollower(streamerId, dates[0], dates[1]);

        List<FindStreamerFollowDto> ret = new ArrayList<>();

        for(int i=0; i<list.size(); i++){
            ret.add(new FindStreamerFollowDto(list.get(i).getRegDt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), list.get(i).getFollower()));
        }

        return ret;
    }

    @Override
    public FindStreamerViewerDto streamerDetailViewer(Long streamerId, LocalDate[] dates, String[] dtCode) {

        List<FindStreamerDailyViewerResDtoInterface> curr = streamerPort.streamerDetailViewer(streamerId, dates[0], dates[1]);
        List<FindStreamerDailyViewerResDtoInterface> before = streamerPort.streamerDetailViewer(streamerId, dates[2], dates[3]);
        StreamerEntity streamerEntity = new StreamerEntity();
        streamerEntity.setStreamerId(streamerId);
        StatisticsEntity statisticsEntity = streamerPort.streamerStatistics(streamerEntity, dtCode[0]);


        List<DailyAvgViewer> dailyAvgViewer = new ArrayList<>();

        for(LocalDate date = dates[0]; !date.isAfter(dates[1]); date = date.plusDays(1)){
            dailyAvgViewer.add(new DailyAvgViewer(date.toString(),0,0));
        }

        int index = 0;
        int curr_max = 0;
        int curr_avg = 0;

        if(!curr.isEmpty()){

            for(FindStreamerDailyViewerResDtoInterface var : curr){
                while ( index < dailyAvgViewer.size() && !dailyAvgViewer.get(index).getDate().equals(var.getDate()) ){
                    index++;
                }
                if(index>=dailyAvgViewer.size()) break;
                dailyAvgViewer.get(index).setMaxViewer(var.getMaxViewer());
                dailyAvgViewer.get(index).setViewer(var.getViewer());
            }
            curr_avg = statisticsEntity.getAverageViewer();
            curr_max = statisticsEntity.getTopViewer();
        }

        int before_max = 0;
        int before_avg = 0;

        if(!before.isEmpty()){

            statisticsEntity = streamerPort.streamerStatistics(streamerEntity, dtCode[1]);
            if(statisticsEntity != null){
                before_avg = statisticsEntity.getAverageViewer();
                before_max = statisticsEntity.getTopViewer();
            }
        }

        FindStreamerViewerDto dto = new FindStreamerViewerDto(curr_max, curr_max - before_max, curr_avg, curr_avg - before_avg, dailyAvgViewer);

        return dto;
    }

    @Override
    public FindStreamerRatingDto streamerDetailRating(Long streamerId, LocalDate[] dates, String[] dtCode) {

        StreamerEntity streamerEntity = streamerPort.findByStreamerId(streamerId);
        StatisticsEntity statisticsEntity = streamerPort.streamerStatistics(streamerEntity, dtCode[0]);
        List<FindStreamerRatingResDtoInterface> list = streamerPort.streamerDetailRating(streamerId, dates[0], dates[1]);

        List<DailyRate> dailyRates = new ArrayList<>();

        for(LocalDate date = dates[0]; !date.isAfter(dates[1]); date = date.plusDays(1)){
            dailyRates.add(new DailyRate(date.toString(),0.00,0.00));
        }

        if(list.isEmpty()){
            return FindStreamerRatingDto.builder().dailyRates(dailyRates).totalRating(0.00).platformRating(0.00).build();
        }

        double totalRating = 0, platformRating = 0;
        int index = 0;

        if(streamerEntity.getPlatform() == 'C'){

            for(FindStreamerRatingResDtoInterface val : list){
                while ( index < dailyRates.size() && !dailyRates.get(index).getDate().equals(val.getDate()) ){
                    index++;
                }
                if(index>=dailyRates.size()) break;
                dailyRates.get(index).setTotal(val.getTotalRating());
                dailyRates.get(index).setPlatform(val.getChzzkRating());
            }

            totalRating = statisticsEntity.getRating();
            platformRating = statisticsEntity.getChzzRating();

        }
        else{

            for(FindStreamerRatingResDtoInterface val : list){
                while ( index < dailyRates.size() && !dailyRates.get(index).getDate().equals(val.getDate()) ){
                    index++;
                }
                if(index>=dailyRates.size()) break;
                dailyRates.get(index).setTotal(val.getTotalRating());
                dailyRates.get(index).setPlatform(val.getSoopRating());
            }
            totalRating = statisticsEntity.getRating();
            platformRating = statisticsEntity.getSoopRating();
        }

        return FindStreamerRatingDto.builder().dailyRates(dailyRates).totalRating(totalRating).platformRating(platformRating).build();
    }

    @Override
    public FindStreamerCategoryDto streamerDetailCategory(Long streamerId, LocalDateTime[] dates) {

        List<FindStreamerCategoryResDtoInterface> list = streamerPort.streamerDetailCategory(streamerId, dates[0], dates[1]);
        List<DailyCategory> dailyCategories = new ArrayList<>();

        int totalTime = 0;

        for(FindStreamerCategoryResDtoInterface val : list){

            totalTime += val.getTime();
            dailyCategories.add(DailyCategory.builder().date(val.getDate()).time(val.getTime()).category(val.getCategory()).avgViewer(val.getAvgViewer()).build());

        }

        return FindStreamerCategoryDto.builder().totalTime(totalTime).dailyCategories(dailyCategories).build();
    }

    @Override
    public FindStreamerTimeDto streamerDetailTime(Long streamerId, LocalDate[] dates, String[] dtCodes, LocalDateTime[] specificDates) {

        List<FindTimeDetailResDtoInterface> timeResult = streamerPort.streamerDetailTime(streamerId, dates[0], dates[1]);

        List<DailyTime> dailyTimes = new ArrayList<>();
        int index = 0;

        for(LocalDate date = dates[0]; !date.isAfter(dates[1]); date = date.plusDays(1)){
            dailyTimes.add(new DailyTime(date.toString(),0));
        }

        for(FindTimeDetailResDtoInterface result : timeResult){
            while ( index < dailyTimes.size() && !dailyTimes.get(index).getDate().equals(result.getDate()) ){
                index++;
            }
            if(index >= dailyTimes.size()) break;
            dailyTimes.get(index).setDate(result.getDate());
            dailyTimes.get(index).setTotalAirTime(result.getTotalAirTime());
        }

        FindSummaryRankResDtoInterface curr = streamerPort.streamerDetailSummary(streamerId, dtCodes[0], specificDates[0], specificDates[1]);
        FindSummaryRankResDtoInterface before = streamerPort.streamerDetailSummary(streamerId, dtCodes[1], specificDates[2], specificDates[3]);

        FindStreamerTimeDto ret = new FindStreamerTimeDto(0,0,dailyTimes);

        if(curr != null){
            ret.setTotalTime(curr.getTotalAirTime());
            ret.setTimeDiff(curr.getTotalAirTime());
        }

        if(before != null){
            ret.setTimeDiff(ret.getTotalTime() - before.getTotalAirTime());
        }

        return ret;
    }

    @Override
    public List<FindStreamerRecordDtoInterface> streamerDetailRecord(Long streamerId) {

        List<FindStreamerRecordDtoInterface> result =  streamerPort.streamerRecord(streamerId);

        return result;
    }

}
