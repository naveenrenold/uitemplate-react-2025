CREATE TABLE [Form] (
  [Id] int PRIMARY KEY,
  [TypeId] int,
  [StatusId] int,
  [ProcessId] int,
  [CustomerName] varchar(100),
  [CustomerAddress] varchar(100),
  [Location] varchar(30),
  [CreatedBy] varchar(100),
  [CreatedOn] datetime,
  [LastUpdatedBy] varchar(100),
  [LastUpdatedOn] datetime
)
GO

CREATE TABLE [FormType] (
  [TypeId] int PRIMARY KEY,
  [TypeName] varchar(30)
)
GO

CREATE TABLE [FormStatus] (
  [StatusId] int PRIMARY KEY,
  [StatusName] varchar(30)
)
GO

CREATE TABLE [Process] (
  [ProcessId] int PRIMARY KEY,
  [ProcessName] varchar(30)
)
GO

CREATE TABLE [Attachment] (
  [AttachmentId] int PRIMARY KEY,
  [Id] int,
  [FileName] varchar(100),
  [FilePath] varchar(500),
  [UploadedBy] varchar(100),
  [UploadedOn] varchar(100)
)
GO

CREATE TABLE [Activity] (
  [ActivityId] int PRIMARY KEY,
  [Id] int,
  [ActivityTypeId] int,
  [Comments] varchar(500),
  [CreatedBy] varchar(100),
  [CreatedOn] varchar(100)
)
GO

CREATE TABLE [ActivityType] (
  [ActivityTypeId] int PRIMARY KEY,
  [ActivityTypeName] varchar(100)
)
GO

ALTER TABLE [Form] ADD FOREIGN KEY ([TypeId]) REFERENCES [FormType] ([TypeId])
GO

ALTER TABLE [Form] ADD FOREIGN KEY ([StatusId]) REFERENCES [FormStatus] ([StatusId])
GO

ALTER TABLE [Form] ADD FOREIGN KEY ([ProcessId]) REFERENCES [Process] ([ProcessId])
GO

ALTER TABLE [Attachment] ADD FOREIGN KEY ([Id]) REFERENCES [Form] ([Id])
GO

ALTER TABLE [Activity] ADD FOREIGN KEY ([Id]) REFERENCES [Form] ([Id])
GO

ALTER TABLE [Activity] ADD FOREIGN KEY ([ActivityTypeId]) REFERENCES [ActivityType] ([ActivityTypeId])
GO
