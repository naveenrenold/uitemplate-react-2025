DECLARE @LocalDateTime DATETIME,
@LocationId int = 1,
@Id int = 100090,
-- @TypeId varchar(30) = 2,
-- @StatusId varchar(30)= '3',
-- @ProcessId varchar(30) = '4',
-- @CustomerName varchar(30) = 'New Test',
-- @CustomerAddress varchar(30) = 'New Test Address',
-- @PhoneNumber varchar(30) = '7358639625',
-- @PhoneNumber2 varchar(30) = '7358639626',
 @LastUpdatedBy varchar(30) = 'NaveenRenold@navigatorxdd.onmicrosoft.com',


@TypeId varchar(30),
@StatusId varchar(30),
@ProcessId varchar(30),
@CustomerName varchar(30),
@CustomerAddress varchar(30),
@PhoneNumber varchar(30),
@PhoneNumber2 varchar(30),

@PrevTypeId varchar(30),
@PrevStatusId varchar(30),
@PrevProcessId varchar(30),
@PrevCustomerName varchar(30),
@PrevCustomerAddress varchar(30),
@PrevLocationId varchar(30),
@PrevPhoneNumber varchar(30),
@PrevPhoneNumber2 varchar(30),
@PrevLastUpdatedBy varchar(30);

exec getLocalDate @LocalDateTime OUTPUT;

Select @PrevTypeId = TypeId,
 @PrevStatusId = StatusId,
 @PrevProcessId     = ProcessId,
@PrevCustomerName = CustomerName,
@PrevCustomerAddress = CustomerAddress,
@PrevLocationId = LocationId,
@PrevPhoneNumber = PhoneNumber,
@PrevPhoneNumber2 = PhoneNumber2
from form 
where Id = @Id;

IF(@TypeId is not NULL and @TypeId <> @PrevTypeId)
BEGIN
Select 1
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Select @Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'TypeName', T1.TypeName, T.TypeName 
from FormType T inner join FormType T1 on T1.TypeId = @PrevTypeId WHERE T.TypeId = @TypeId; 
END


IF(@StatusId is not NULL and @StatusId <> @PrevStatusId)
BEGIN
Select 1
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Select @Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'StatusName', T1.StatusName, T.StatusName 
from FormStatus T inner join FormStatus T1 on T1.StatusId = @PrevStatusId WHERE T.StatusId = @StatusId; 
END

IF(@ProcessId is not NULL and @ProcessId <> @PrevProcessId)
BEGIN
Select 1
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Select @Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'ProcessName', T1.ProcessName, T.ProcessName 
from Process T inner join Process T1 on T1.ProcessId = @PrevProcessId WHERE T.ProcessId = @ProcessId; 
END

IF(@LocationId is not NULL and @LocationId <> @PrevLocationId)
BEGIN
Select 1
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Select @Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'LocationName', T1.LocationName, T.LocationName 
from Location T inner join Location T1 on T1.LocationId = @PrevLocationId WHERE T.LocationId = @LocationId; 
END


IF(@CustomerName is not NULL and @CustomerName <> @PrevCustomerName)
BEGIN
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Values (@Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'CustomerName', @PrevCustomerName, @CustomerName) 
END

IF(@CustomerAddress is not NULL and @CustomerAddress <> @PrevCustomerAddress)
BEGIN
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Values (@Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'CustomerAddress', @PrevCustomerAddress, @CustomerAddress) 
END

IF(@PhoneNumber is not NULL and @PhoneNumber <> @PrevPhoneNumber)
BEGIN
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Values (@Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'PhoneNumber', @PrevPhoneNumber, @PhoneNumber) 
END

IF(@PhoneNumber2 is not NULL and @PhoneNumber2 <> @PrevPhoneNumber2)
BEGIN
Insert into Activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
Values (@Id, 2, '', @LastUpdatedBy, @LocalDateTime, 'PhoneNumber2', @PrevPhoneNumber2, @PhoneNumber2) 
END


Select * from Activity
Select * from Form

    







Select @LocationId = LocationId from Location where LocationName = @Location;
    UPDATE Form
    SET TypeId = IIF(@TypeId is NULL, TypeId, @TypeId),
        StatusId = IIF(@StatusId is NULL, StatusId, @StatusId),
        ProcessId = IIF(@ProcessId is NULL, ProcessId, @ProcessId),
        CustomerName = IIF(@CustomerName is NULL, CustomerName, @CustomerName),
        CustomerAddress = IIF(@CustomerAddress is NULL, CustomerAddress, @CustomerAddress),
        LocationId = IIF(@LocationId is NULL, LocationId, @LocationId),
        phoneNumber = IIF(@PhoneNumber is NULL, phoneNumber, @PhoneNumber),
        phoneNumber2 = IIF(@PhoneNumber2 is NULL, phoneNumber2, @PhoneNumber2),
        LastUpdatedBy = IIF(@LastUpdatedBy is NULL, LastUpdatedBy, @LastUpdatedBy),
        LastUpdatedOn =  @LocalDateTime
    WHERE Id = @Id;