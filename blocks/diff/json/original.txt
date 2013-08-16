package org.jetbrains.jing.localCopy.impl;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.jetbrains.jing.common.*;

import java.io.*;
import java.nio.file.Path;
import java.util.*;

abstract class PlatformSpecifics {
  public static final boolean isWindows = System.getProperty("os.name").toLowerCase().contains("windows");
  public static final boolean isMac = System.getProperty("os.name").toLowerCase().contains("mac");

  public static final PlatformSpecifics INSTANCE = isWindows ? new Win32PlatformSpecifics() : isMac ? new MacPlatformSpecifics() : DefaultPlatformSpecifics.INSTANCE;

  public abstract boolean fileWatcherSupported();

  public abstract @NotNull Process startFileWatcher() throws Exception;

  public abstract int fileWatcherEventsMaxDelay();

  public abstract boolean fileIdsSupported();

  /** True if file watcher sends notifications about individual file operations and false if it sends rescan events for directories only. */
  public abstract boolean fileWatcherDetectsFileLevelEvents();

  public abstract boolean fileWatcherDetectsFileRenames();
  public abstract boolean fileWatcherDetectsDirectoryRenames();
  public abstract boolean fileWatcherDetectsFileMoves();
  public abstract boolean fileWatcherDetectsDirectoryMoves();

  public abstract boolean fileExecutableAttributeSupported();

  public abstract @Nullable FileInfo getFileInfo(@NotNull Path path);

  public boolean pathStartsWith(@NotNull Path path, @NotNull Path other) {
    return path.startsWith(other);
  }

  @Nullable
  public PathFromRoot pathFromRoot(@NotNull Path path, @NotNull Path rootPath){
    if (!path.startsWith(rootPath)) return null;
    return PathFromRoot.parse(rootPath.relativize(path).toString(), File.separatorChar);
  }

  public static class FileInfo{
    public final boolean isDirectory;
    public final long creationTime;
    public final long lastWriteTime;
    public final long fileSize;
    @Nullable public final Long fileId;

    public FileInfo(final boolean isDirectory, final long creationTime, final long lastWriteTime, final long fileSize, @Nullable final Long fileId) {
      this.isDirectory = isDirectory;
      this.creationTime = creationTime;
      this.lastWriteTime = lastWriteTime;
      this.fileSize = fileSize;
      this.fileId = fileId;
    }

    @Override
    public boolean equals(final Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;

      final FileInfo fileInfo = (FileInfo)o;

      if (creationTime != fileInfo.creationTime) return false;
      if (!Objects.equals(fileId, fileInfo.fileId)) return false;
      if (fileSize != fileInfo.fileSize) return false;
      if (isDirectory != fileInfo.isDirectory) return false;
      if (lastWriteTime != fileInfo.lastWriteTime) return false;

      return true;
    }

    @Override
    public int hashCode() {
      return (int)(lastWriteTime ^ (lastWriteTime >>> 32));
    }

    @Override public String toString() {
      return "FileInfo{" +
              "isDirectory=" + isDirectory +
              ", creationTime=" + creationTime +
              ", lastWriteTime=" + lastWriteTime +
              ", fileSize=" + fileSize +
              ", fileId=" + fileId +
              '}';
    }
  }
}